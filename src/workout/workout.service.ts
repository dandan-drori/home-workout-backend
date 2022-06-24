import { Inject, Injectable } from '@nestjs/common';
import { Log } from "./workout.model";

@Injectable()
export class WorkoutService {
  collection;
  constructor(@Inject('MONGODB_CONNECTION') private readonly db: any) {
    this.collection = db.collection('workout');
  }

  async getReps(): Promise<number> {
    try {
      const oneDayMs = 86400000;
      const workouts = await this.collection.find({}).toArray();
      const startDate = workouts[0].startDate;
      const datesDiff = Date.now() - startDate;
      const totalDaysDiff = Math.floor(datesDiff / oneDayMs);
      if (workouts[0].daysDiff && totalDaysDiff > workouts[0].daysDiff) {
        await this.collection.updateOne(
          { _id: workouts[0]._id },
          { $set: { daysDiff: totalDaysDiff } },
        );
        await this.logWorkout(workouts[0]);
        await this.resetSets(workouts[0]._id);
      }
      return this.subtractReps(totalDaysDiff);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async resetSets(id?: string) {
    try {
      if (!id) {
        const workouts = await this.collection.find({}).toArray();
        id = workouts[0]._id;
      }
      await this.collection.updateOne({ _id: id }, { $set: { sets: 0 } });
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

  async logWorkout(workout) {
    try {
      const reason = this.getRestReason();
      const _id = workout._id;
      const logs = reason
        ? { reason, date: Date.now() }
        : { sets: workout.sets, date: Date.now() };
      await this.collection.updateOne({ _id }, { $push: { logs } });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getWorkoutLogs(): Promise<Log[]> {
    try {
      const workouts = await this.collection.find({}).toArray();
      return workouts[0].logs;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  subtractReps(daysDiff: number): number {
    const repsToSubtractMap = {
      daysInWeekend: 2, // remove weekends
      daysWorkingFromTheOffice: 3, // remove office work days
    };
    const repsToSubtract = Object.values(repsToSubtractMap).reduce(
      (acc: number, reps: number) => {
        const weeksInDiff = Math.floor(daysDiff / 7);
        return acc + reps * weeksInDiff;
      },
    );
    return daysDiff - repsToSubtract;
  }

  getRestReason(): string {
    const weekDayNumber = new Date().getDay();
    if (weekDayNumber >= 5) {
      return 'Weekend';
    }
    if (!weekDayNumber) {
      return 'Office';
    }
  }
}
