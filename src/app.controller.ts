import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from './app.service';

@Controller('workout')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('reps')
  getReps(): Promise<number> {
    return this.appService.getReps();
  }

  @Get('sets-reset')
  resetSets(): Promise<number> {
    return this.appService.resetSets();
  }

  @Get('sets')
  getSets(): Promise<number> {
    return this.appService.getSets();
  }

  @Get('targetSets')
  getTargetSets(): Promise<number> {
    return this.appService.getTargetSets();
  }

  @Post('sets')
  updateSets(@Body() { diff }: { diff: number }): Promise<number> {
    return this.appService.updateSets(diff);
  }
}
