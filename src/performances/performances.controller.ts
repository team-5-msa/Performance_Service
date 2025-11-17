import { Controller } from '@nestjs/common';
import { PerformancesService } from './performances.service';

@Controller('performances')
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}
}
