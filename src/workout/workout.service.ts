import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class WorkoutService {
  collection;
  constructor(@Inject('MONGODB_CONNECTION') private readonly db: any) {
    this.collection = db.collection('workout');
  }

  async getReps(): Promise<number> {
    const oneDayMs = 86400000;
    const workouts = await this.collection.find({}).toArray();
    const startDate = workouts[0].startDate;
    const datesDiff = Date.now() - startDate;
    const daysDiff = Math.floor(datesDiff / oneDayMs);
    // don't include weekends
    const weekendsInDiff = Math.floor(daysDiff / 7);
    const daysInWeekend = 2;
    return daysDiff - weekendsInDiff * daysInWeekend;
  }

  async resetSets() {
    try {
      const workouts = await this.collection.find({}).toArray();
      const _id = workouts[0]._id;
      await this.collection.updateOne({ _id }, { $set: { sets: 0 } });
      return 0;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getSets() {
    try {
      const workouts = await this.collection.find({}).toArray();
      return workouts[0].sets;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getTargetSets() {
    try {
      const workouts = await this.collection.find({}).toArray();
      return workouts[0].targetSets;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async updateSets(diff) {
    try {
      const workouts = await this.collection.find({}).toArray();
      const _id = workouts[0]._id;
      const sets = workouts[0].sets + diff;
      await this.collection.updateOne({ _id }, { $set: { sets } });
      return sets;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
