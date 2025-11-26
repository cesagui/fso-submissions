import { useState } from 'react'

const Button = ({onClick, text}) => {
  return (
    <button onClick = {onClick}>
      {text}
    </button>
  );
}

const Entry = ({name, value}) => {
  return (
    <p>
      {name} {value}
    </p>
  );
}

const Statistics = ({good, neutral, bad, total, averageScore, posPercent}) => {
  if (total ==- 0){
    return (
      <p>No feedback received, come back later!</p>
    )
  }
  return (
    <>
      <Entry name = 'good' value = {good}/>
      <Entry name = 'neutral' value = {neutral}/>
      <Entry name = 'bad' value = {bad}/> 
      <Entry name = 'all' value = {total}/>
      <Entry name = 'average' value = {averageScore}/>
      <Entry name = 'positive' value = {posPercent}/>
    </>
  );
    
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const totalRatings = good + bad + neutral;
  const averageScore = (totalRatings === 0) ? 0 : (good - bad) / totalRatings;
  const posPercent = (totalRatings === 0) ? "0%" :(good / totalRatings * 100) + "%";

  const handleGoodClick = () => {
    setGood(good + 1);
  }
  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  }

  const handleBadClick = () => {
    setBad(bad + 1);
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick = {handleGoodClick} text = 'good'/>
      <Button onClick = {handleNeutralClick} text = 'neutral'/>
      <Button onClick = {handleBadClick} text = 'bad'/>
      <h1>statistics</h1>
      <Statistics good = {good} neutral = {neutral} bad = {bad} total = {totalRatings} averageScore={averageScore} posPercent={posPercent}/>
    </div>
  )
}

export default App