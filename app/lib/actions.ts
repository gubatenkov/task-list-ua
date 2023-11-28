'use server'

import type { TTaskLabelValue, TTask } from '@/app/lib/schemaTypes'
import type { FieldValues } from 'react-hook-form'
import type { Session } from 'next-auth'

import {
  validatePriorityFilter,
  validateStatusFilter,
  validPageParams,
} from '@/app/lib/utils'
import { UserCredentialsSchema, type TTaskForm } from '@/app/lib/schemaTypes'
import { signOut, signIn, auth } from '@/auth'
import { safeParse, string } from 'valibot'
import { revalidateTag } from 'next/cache'
import prisma from '@/app/lib/prisma'
import { hash } from 'bcryptjs'

import TaskWhereInput = Prisma.TaskWhereInput
import { Prisma } from '.prisma/client'

export const createUser = async (formData: FieldValues) => {
  const validatedCredentials = safeParse(UserCredentialsSchema, formData)

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedCredentials.success) {
    return {
      message: 'Missing Fields. Failed to Create User.',
      errors: validatedCredentials.issues,
    }
  }

  const { password, email, name } = validatedCredentials.output

  // Before we create a new user, check if there is existing one
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    // If it does - return message
    if (existingUser) {
      return {
        error: {
          message: `User with email ${existingUser.email} already exist.`,
          data: null,
        },
        success: false,
      }
    }
  } catch (error) {
    // Handle errors
    console.log('Error trying to check user data:', error)
    return {
      error: {
        data: JSON.stringify((error as Error).message),
        message: 'Error trying to check user data.',
      },
      success: false,
    }
  }

  try {
    // Finally create new user record
    const user = await prisma.user.create({
      data: {
        password: await hash(password, 10),
        email,
        name,
      },
    })
    return {
      message: `The user with email ${email} was successfully created.`,
      success: true,
    }
  } catch (error) {
    // Handle errors
    console.log('Error while creating new user:', error)
    return {
      error: {
        data: JSON.stringify((error as Error).message),
        message: 'Error while creating new user.',
      },
      success: false,
    }
  }
}

export async function authenticateUserViaCredentials(formData: FieldValues) {
  try {
    await signIn('credentials', {
      redirect: false,
      ...formData,
    })

    return {
      message: 'Authenticated successfully.',
      success: true,
    }
  } catch (error) {
    return {
      error: {
        data: JSON.stringify((error as Error).message),
        message: 'Authentication failed.',
      },
      success: false,
    }
  }
}

export async function authenticateUserViaGithub() {
  try {
    const response = await signIn('github', {
      redirect: false,
    })

    return {
      message: 'Authenticated successfully.',
      redirectUrl: response,
      success: true,
    }
  } catch (error) {
    return {
      error: {
        data: JSON.stringify((error as Error).message),
        message: 'Authentication failed.',
      },
      redirectUrl: null,
      success: false,
    }
  }
}

export async function signOutUser() {
  try {
    await signOut({ redirect: false })
    return {
      message: 'Successful logout.',
      success: true,
    }
  } catch (error) {
    return {
      error: {
        data: JSON.stringify((error as Error).message),
        message: 'Logout failed.',
      },
      success: false,
    }
  }
}

type MySession = Omit<Session, 'user'> & {
  user: { email: string; image: string; name: string; id: string }
}

export async function getTasksCount(): Promise<number> {
  const session = (await auth()) as MySession
  if (!session?.user?.id) return 0

  try {
    return await prisma.task.count()
  } catch (error) {
    console.log(error)
  }
  return 0
}

export async function getUserTasks({
  perPageParam,
  pageParam,
  priority,
  status,
  query,
}: {
  priority: undefined | string[] | string
  status: undefined | string[] | string
  perPageParam: undefined | string
  pageParam: undefined | string
  query: undefined | string
}): Promise<{ totalTaskCount: number; tasks: TTask[] }> {
  const session = (await auth()) as MySession | null
  /* If no user id handle error (in this case just return empty array),
  otherwise continue. */
  if (!session?.user?.id) return { totalTaskCount: 0, tasks: [] }

  // Prepare parameters
  const validPriority = validatePriorityFilter(priority)
  const validStatus = validateStatusFilter(status)
  const contains = query || ''
  const { perPage, page } = validPageParams({
    perPageParam,
    pageParam,
  })

  // Specify query params
  const where: TaskWhereInput = {
    title: {
      mode: 'insensitive',
      contains,
    },
    priority: {
      contains: validPriority,
    },
    status: {
      contains: validStatus,
    },
    // For now return tall asks for each user in system
    // userId: session.user.id,
  }

  try {
    const tasks = (await prisma.task.findMany({
      // sorting
      orderBy: {
        createdAt: 'desc',
      },
      // pagination
      skip: (page - 1) * perPage,
      take: perPage,
      // params
      where,
    })) as TTask[]

    const totalTaskCount = await prisma.task.count<
      { where: typeof where } | {}
    >(
      query || priority || status
        ? {
            where,
          }
        : {}
    )
    return { totalTaskCount, tasks }
  } catch (error) {
    console.log(error)
    return { totalTaskCount: 0, tasks: [] }
  }
}

export async function createTask(formFields: TTaskForm) {
  // Get session
  const session = (await auth()) as MySession

  // Return message if session is not valid
  if (!session?.user?.id)
    return {
      message: 'There is no user ID for which to assign a task.',
      success: false,
      task: null,
    }

  /*  For third-party providers, first create a
   *  passwordless user record */
  try {
    const isUserExist = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })

    if (!isUserExist) {
      await prisma.user.create({
        data: {
          email: session.user.email,
          image: session.user.image,
          name: session.user.name,
          id: session.user.id,
          password: '',
        },
      })
    }
  } catch (error) {
    return {
      message: `Error trying to create task.`,
      success: false,
      task: null,
    }
  }

  // Finally, create and assign new task to user
  try {
    const newTask = await prisma.task.create({
      data: { ...formFields, userId: session.user.id },
    })
    revalidateTag('/tasks')
    return { message: `Task has been created.`, success: true, task: newTask }
  } catch (error) {
    return {
      message: `Error trying to create task.`,
      success: false,
      task: null,
    }
  }
}

export async function updateTask(taskId: unknown, formFields: TTaskForm) {
  const validTaskId = safeParse(string(), taskId)

  // Return message if no task id
  if (!validTaskId.success)
    return {
      message: 'Task id is not valid.',
      success: false,
      task: null,
    }

  // Create and assign new task to user
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: validTaskId.output,
      },
      data: formFields,
    })
    revalidateTag('/tasks')
    return {
      message: `Task info has been updated.`,
      task: updatedTask,
      success: true,
    }
  } catch (error) {
    console.log(error)
    return {
      message: `Error trying to create task.`,
      success: false,
      task: null,
    }
  }
}

export async function getUserTaskById(id: unknown) {
  const validatedTaskId = safeParse(string(), id)

  // If validation fails, return errors early. Otherwise, continue.
  if (!validatedTaskId.success) {
    return { message: 'Invalid task id.', success: false }
  }

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: validatedTaskId.output,
      },
    })
    return { success: true, task }
  } catch (e) {
    return {
      // message: 'Error trying to get task by provided id.',
      success: false,
      task: null,
    }
  }
}

export async function deleteTask(id: string) {
  try {
    const deletedTask = await prisma.task.delete({
      where: {
        id,
      },
    })
    return {
      message: `Task ${deletedTask.id} has been deleted.`,
      success: true,
    }
  } catch (error) {
    console.log(error)
    return {
      message: 'An error occurred while trying to delete a task',
      success: false,
    }
  }
}

export async function updateTaskLabelById(
  taskId: string,
  label: TTaskLabelValue
) {
  try {
    await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        label,
      },
    })
    return { success: true }
  } catch (error) {
    console.log(error)
    return { success: false }
  }
}
