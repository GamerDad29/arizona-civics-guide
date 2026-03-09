import type { BillStatus } from '../data/bills';

interface Props {
  status: BillStatus;
}

const classes: Record<BillStatus, string> = {
  active: 'status-chip active',
  passed: 'status-chip passed',
  failed: 'status-chip failed',
  pending: 'status-chip',
};

const labels: Record<BillStatus, string> = {
  active: 'Active',
  passed: 'Passed',
  failed: 'Failed',
  pending: 'Pending',
};

export function StatusChip({ status }: Props) {
  return <span className={classes[status]}>{labels[status]}</span>;
}
