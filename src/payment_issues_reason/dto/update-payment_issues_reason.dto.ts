import { PartialType } from '@nestjs/swagger';
import { CreatePaymentIssuesReasonDto } from './create-payment_issues_reason.dto';

export class UpdatePaymentIssuesReasonDto extends PartialType(CreatePaymentIssuesReasonDto) {}
