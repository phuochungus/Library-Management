import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import Rule from 'src/entities/Rule';
import { MongoEntityManager } from 'typeorm';

@Injectable()
export class RulesService implements OnModuleInit {
  constructor(
    @InjectEntityManager('mongoDB')
    private entityManager: MongoEntityManager,
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
    for (let i in this.currentRules) {
      if (this.currentRules[i].about == about) {
        this.currentRules[i].value = value;
        await this.entityManager.save(this.currentRules[i]);
        return this.currentRules[i];
      }
    }
    return null;
  }
}
