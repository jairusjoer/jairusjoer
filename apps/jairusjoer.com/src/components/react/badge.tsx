export interface Props {
  label: string;
}

const Badge = ({ label }: Props) => {
  return <i className="bg-background-subtle group-open:bg-background rounded px-1 not-italic print:border">{label}</i>;
};

export default Badge;
