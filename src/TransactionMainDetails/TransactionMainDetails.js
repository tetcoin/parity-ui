import React, { Component, PropTypes } from 'react';

import ContractIcon from 'material-ui/svg-icons/action/code';
import ReactTooltip from 'react-tooltip';

import * as tUtil from '../util/transaction';
import Account from '../Account';
import styles from './TransactionMainDetails.css';

export default class TransactionMainDetails extends Component {

  static propTypes = {
    from: PropTypes.string.isRequired,
    fromBalance: PropTypes.string, // wei hex, not required since it might take time to fetch
    value: PropTypes.string.isRequired, // wei hex
    totalValue: PropTypes.object.isRequired, // wei Big Number
    chain: PropTypes.string.isRequired,
    to: PropTypes.string, // undefined if it's a contract
    toBalance: PropTypes.string, // wei hex - undefined if it's a contract
    className: PropTypes.string
  };

  state = {
    valueDisplay: tUtil.getValueDisplay(this.props.value),
    totalValueDisplay: tUtil.getTotalValueDisplay(this.props.totalValue)
  }

  componentWillReceiveProps (nextProps) {
    const { value, totalValue } = nextProps;
    this.setState({
      valueDisplay: tUtil.getValueDisplay(value),
      totalValueDisplay: tUtil.getTotalValueDisplay(totalValue)
    });
  }

  render () {
    const { className } = this.props;
    return (
      <div className={ className }>
        { this.renderTransfer() }
        { this.renderContract() }
      </div>
    );
  }

  renderTransfer () {
    const { from, fromBalance, to, toBalance, chain } = this.props;
    if (!to) {
      return;
    }

    return (
      <div className={ styles.transaction }>
        <div className={ styles.from }>
          <Account address={ from } balance={ fromBalance } chain={ chain } />
        </div>
        <div className={ styles.tx }>
          { this.renderValue() }
          <div>&rArr;</div>
          { this.renderTotalValue() }
        </div>
        <div className={ styles.to }>
          <Account address={ to } balance={ toBalance } chain={ chain } />
        </div>
      </div>
    );
  }

  renderContract () {
    const { from, fromBalance, to, chain } = this.props;
    if (to) {
      return;
    }
    return (
      <div className={ styles.transaction }>
        <div className={ styles.from }>
          <Account address={ from } balance={ fromBalance } chain={ chain } />
        </div>
        <div className={ styles.tx }>
          { this.renderValue() }
          <div>&rArr;</div>
          { this.renderTotalValue() }
        </div>
        <div className={ styles.contract }>
          <ContractIcon className={ styles.contractIcon } />
          <br />
          Contract
        </div>
      </div>
    );
  }

  renderValue () {
    const { id } = this.props;
    const { valueDisplay } = this.state;
    return (
      <div>
        <div
          data-tip
          data-for={ 'value' + id }
          data-effect='solid'
          >
          <strong>{ valueDisplay } </strong>
          <small>ETH</small>
        </div>
        <ReactTooltip id={ 'value' + id }>
          <strong>{ valueDisplay }</strong>
          The value of the transaction.<br />
        </ReactTooltip>
      </div>
    );
  }

  renderTotalValue () {
    const { id } = this.props;
    const { totalValueDisplay } = this.state;
    return (
      <div>
        <div
          data-tip
          data-for={ 'totalValue' + id }
          data-effect='solid'
          data-place='bottom'
          className={ styles.total }>
          { totalValueDisplay } <small>ETH</small>
        </div>
        <ReactTooltip id={ 'totalValue' + id }>
          <strong>{ totalValueDisplay }</strong>:
          The value of the transaction including the mining fee. <br />
          This is the maximum amount of ether you could pay.
        </ReactTooltip>
      </div>
    );
  }

}
