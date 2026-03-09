interface Props {
  vote: 'yes' | 'no' | 'abstain';
}

const classes = {
  yes: 'vote-yes',
  no: 'vote-no',
  abstain: 'vote-abs',
};

const labels = {
  yes: 'YES',
  no: 'NO',
  abstain: 'ABS',
};

export function VoteBadge({ vote }: Props) {
  return <span className={`vote-badge ${classes[vote]}`}>{labels[vote]}</span>;
}
