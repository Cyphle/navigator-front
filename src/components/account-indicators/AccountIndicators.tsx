export interface AccountIndicatorsProps {
  startOfPeriodAmount: number;
  currentPeriodAmount: number;
  endOfPeriodProjectedAmount: number
}

// TODO to be tested
export const AccountIndicators = (props: AccountIndicatorsProps) => {
  return (
    <section className="summary">
      <div className="indicator">
        <span className="indicator__label">Montant début de mois</span>
        <span className="indicator__value">{ props.startOfPeriodAmount }€</span>
      </div>
      <div className="indicator">
        <span className="indicator__label">Montant actuel</span>
        <span className="indicator__value">{ props.currentPeriodAmount }€</span>
      </div>
      <div className="indicator">
        <span className="indicator__label">Montant projeté fin de mois</span>
        <span className="indicator__value">{ props.endOfPeriodProjectedAmount }€</span>
      </div>
    </section>
  )
}