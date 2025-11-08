import { Module, Global } from '@nestjs/common';
import { AppLogger } from './logger.service';

@Global() // 👈 makes the logger available across the whole app
@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}