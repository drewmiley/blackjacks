import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import styles from './Styles.module.css';
import { BLACKJACKS_NOMINATION_VALUE, JACKS_TWOS_EIGHTS_NOMINATION_VALUE, BLACKJACKS, JACK_TWO_EIGHT, GAME_TYPE, SUITS } from '../app/constants';


export default function TurnOptions({ activeCards, playerName, players, turnIndex, playCards }) {
  const dispatch = useDispatch();
  const [cardsIndex, setCardsIndex] = useState();
  const [nominationIndex, setNominationIndex] = useState();

  const isPlayersTurn = players.findIndex(player => player.name === playerName) === turnIndex;
  if (isPlayersTurn) {
    const possibleCardsToPlay = players.find(player => player.name === playerName).possibleCardsToPlay;
    const displayCardsText = cards => cards.length ? cards.map(card => `${card.value} of ${card.suit}`).join(', ') : 'Miss Turn / Pick Up';
    const nominationValue = gameTypeIndex => {
        const isBlackjacks = GAME_TYPE[parseInt(gameTypeIndex)] === BLACKJACKS;
        const isJackTwosAndEights = GAME_TYPE[parseInt(gameTypeIndex)] === JACK_TWO_EIGHT;
        if (isBlackjacks) return BLACKJACKS_NOMINATION_VALUE;
        if (isJackTwosAndEights) return JACKS_TWOS_EIGHTS_NOMINATION_VALUE;
    }
    const isNomination = parseInt(cardsIndex) >= 0 && possibleCardsToPlay[cardsIndex].length > 0
      && possibleCardsToPlay[cardsIndex][possibleCardsToPlay[cardsIndex].length - 1].value === nominationValue(activeCards.gameTypeIndex);
    const onClickTakeTurn = () => {
        dispatch(playCards(playerName, possibleCardsToPlay[cardsIndex], isNomination && SUITS[nominationIndex]));
        setCardsIndex(undefined);
        setNominationIndex(undefined);
    }
    return (
      <>
        <div onChange={e => setCardsIndex(e.target.value)}>
          {possibleCardsToPlay.map((cards, i) => <label className={styles.displayBlock} key={i}>{displayCardsText(cards)}<input type='radio' value={i} name='turnOptions' /></label>)}
        </div>
        {isNomination && <div>
            Nomination Choice
            <div className={styles.nominationChoice} onChange={e => setNominationIndex(e.target.value)}>
              {SUITS.map((suit, i) => <label className={styles.displayBlock} key={i}>{suit}<input type='radio' value={i} name='nominationOptions' /></label>)}
            </div>
        </div>}
        <button onClick={() => onClickTakeTurn()} disabled={!(parseInt(cardsIndex) >= 0) || (isNomination &&  !(parseInt(nominationIndex) >= 0))}>Take Turn</button>
      </>
    )
  } else {
    const whoseTurn = players[(turnIndex + players.length) % players.length].name;
    return `${whoseTurn}'s turn`
  }
}
