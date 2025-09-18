export interface Props {
  label: string;
}

const Badge = ({ label }: Props) => {
  return <i className="bg-background-subtle rounded px-1 not-italic print:border print:!bg-transparent">{label}</i>;
};

export default Badge;
