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
  ) { }

  private DEFAULT_RULES = [
    ['BORROW_DUE', 7],
    ['FINE_PER_DAY', 10000],
    ['RESERVE_DAY', 1],
    ['MINIMUM_AGE', 18],
    ['MAXIMUM_AGE', 100],
    ['BORROW_MAX', 7],
    ['BORROW_INTERVAL', 1],
    ['MAXIMUM_PUBLISH_YEAR_SINCE', 20],
    ['VALID_PERIOD_BY_MONTH_OF_USER_ACCOUNT', 8]]

  async onModuleInit() {
    this.entityManager.watch(Rule).on('change', async (changeEvent) => {
      await this.handleChangeEvent(changeEvent);
    });
    for (let rule of this.DEFAULT_RULES) {
      let ruleDoc = await this.rulesRepository.findOne({
        where: {
          about: rule[0],
        },
      });
      if (!ruleDoc) {
        ruleDoc = new Rule();
        ruleDoc.about = rule[0].toString();
        ruleDoc.value = rule[1].toString();
        await this.rulesRepository.save(ruleDoc);
      }
    }

    this.currentRules = await this.entityManager.find(Rule);
  }

  private currentRules: Rule[] = [];

  private async handleChangeEvent(changeEvent: any) {
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
