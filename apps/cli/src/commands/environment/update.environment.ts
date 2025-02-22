import { Logger } from '@/util/logger'
import BaseCommand from '../base.command'
import { EnvironmentController } from '@keyshade/api-client'
import {
  type CommandActionData,
  type CommandArgument,
  type CommandOption
} from 'src/types/command/command.types'

export class UpdateEnvironment extends BaseCommand {
  getName(): string {
    return 'update'
  }

  getDescription(): string {
    return 'Update a environment'
  }

  getOptions(): CommandOption[] {
    return [
      {
        short: '-n',
        long: '--name <string>',
        description: 'Name of the Environment'
      },
      {
        short: '-d',
        long: '--description <string>',
        description: 'Description about the Environment'
      }
    ]
  }

  getArguments(): CommandArgument[] {
    return [
      {
        name: '<Environment Slug>',
        description: 'Slug of the environment which you want to update.'
      }
    ]
  }

  async action({ options, args }: CommandActionData): Promise<void> {
    const [environmentSlug] = args
    const { name, description } = options

    if (!environmentSlug) {
      Logger.error('Environment slug is required')
      return
    }

    const headers = {
      'x-keyshade-token': this.apiKey
    }

    const environmentData = {
      name,
      description,
      slug: environmentSlug
    }

    const environmentController = new EnvironmentController(this.baseUrl)
    Logger.info('Updating Environment...')

    const {
      success,
      error,
      data: environment
    } = await environmentController.updateEnvironment(environmentData, headers)

    if (success) {
      Logger.info('Environment updated successfully')
      Logger.info(
        `Environment Slug: ${environment.slug}, Name: ${environment.name}, Description: ${environment.description}`
      )
    } else {
      Logger.error(`Error updating Environment: ${error}`)
    }
  }
}
