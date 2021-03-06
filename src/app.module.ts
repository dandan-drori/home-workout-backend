import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkoutModule } from './workout/workout.module';

@Module({
  imports: [WorkoutModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
