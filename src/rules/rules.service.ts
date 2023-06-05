import {
  Injectable,
  OnModuleInit,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { MongoEntityManager, MongoRepository } from 'typeorm';
import Rule from '../entities/Rule';

@Injectable()
export class RulesService implements OnModuleInit {
  constructor(
    @InjectEntityManager('mongoDB')
    private entityManager: MongoEntityManager,
    @InjectRepository(Rule, 'mongoDB')
    private rulesRepository: MongoRepository<Rule>,
  ) {}

  async onModuleInit() {
    console.log('listen to mongodb');
    this.entityManager.watch(Rule).on('change', async (changeEvent) => {
      await this.handleChangeEvent(changeEvent);
    });
    this.currentRules = await this.entityManager.find(Rule);
  }

  private currentRules: Rule[] = [];

  private async handleChangeEvent(changeEvent: {
    operationType: string;
    fullDocument: Rule;
    documentKey: any;
    updateDescription: { updatedFields: any };
  }) {
    if (changeEvent.operationType == 'insert') {
      this.currentRules.push(changeEvent.fullDocument);
    }
    if (changeEvent.operationType == 'update') {
      const _id = changeEvent.documentKey._id;
      for (let i in this.currentRules) {
        if (this.currentRules[i]._id.toString() == _id) {
          this.currentRules[i] = {
            ...this.currentRules[i],
            ...changeEvent.updateDescription.updatedFields,
          };
          break;
        }
      }
    }
  }

  getRule(about: string): string | null {
    for (let rule of this.currentRules) {
      if (rule.about == about) return rule.value;
    }
    return null;
  }

  async updateRule(about: string, value: string) {
    let rule = await this.rulesRepository.findOne({
      where: {
        about,
      },
    });
    if (!rule) throw new HttpException('Bad gateway', HttpStatus.BAD_GATEWAY);

    rule.value = value;

    await this.rulesRepository.save(rule);
  }
}
