import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { Log } from "./workout.model";

@Controller('workout')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Get('reps')
  getReps(): Promise<number> {
    return this.workoutService.getReps();
  }

  @Get('sets-reset')
  resetSets(): Promise<number> {
    return this.workoutService.resetSets();
  }

  @Get('sets')
  getSets(): Promise<number> {
    return this.workoutService.getSets();
  }

  @Get('targetSets')
  getTargetSets(): Promise<number> {
    return this.workoutService.getTargetSets();
  }

  @Get('logs')
  getWorkoutLogs(): Promise<Log[]> {
    return this.workoutService.getWorkoutLogs();
  }

  @Post('sets')
  updateSets(@Body() { diff }: { diff: number }): Promise<number> {
    return this.workoutService.updateSets(diff);
  }
}
