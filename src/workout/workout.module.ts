import { Module } from '@nestjs/common';
import { WorkoutController } from './workout.controller';
import { WorkoutService } from './workout.service';
import { mongoDbProvider } from '../db/mongodb.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [WorkoutController],
  providers: [WorkoutService, mongoDbProvider],
})
export class WorkoutModule {}
