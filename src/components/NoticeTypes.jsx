const noticeTypes = [
  { name: 'Cheque bounce', act: 'Negotiable Instruments Act, S.138' },
  { name: 'Consumer complaint', act: 'Consumer Protection Act, 2019' },
  { name: 'Property/tenancy dispute', act: 'Transfer of Property Act, rent laws' },
  { name: 'Employment/labour notice', act: 'Industrial Disputes Act' },
  { name: 'Court summons', act: 'Code of Civil Procedure, Order V' },
  { name: 'Recovery/demand notice', act: 'Contract Act, general civil law' },
]

export default function NoticeTypes() {
  return (
    <section className="notice-types">
      <div className="wrap">
        <div className="notice-types-head">
          <h2>Notices it's built to read</h2>
          <p>Starting coverage. More statutes are added as the underlying legal reference grows.</p>
        </div>
        <div className="notice-types-list">
          {noticeTypes.map((n) => (
            <div className="notice-type-row" key={n.name}>
              <span className="notice-type-name">{n.name}</span>
              <span className="notice-type-act">{n.act}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
