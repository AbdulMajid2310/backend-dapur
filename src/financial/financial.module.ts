import { Module } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { FinancialController } from './financial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialTransaction } from './entities/financial.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialTransaction, User])],
  controllers: [FinancialController],
  providers: [FinancialService],
})
export class FinancialModule {}
