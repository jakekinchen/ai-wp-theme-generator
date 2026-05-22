type Props = {
  id: string;
  title: string;
  meta?: string;
};

export function SectionHead({ id, title, meta }: Props) {
  return (
    <div className="section-head">
      <div>
        <div className="section-head__id">§ {id}</div>
        <h2 className="section-head__title">{title}</h2>
      </div>
      {meta && <div className="section-head__meta">{meta}</div>}
    </div>
  );
}
