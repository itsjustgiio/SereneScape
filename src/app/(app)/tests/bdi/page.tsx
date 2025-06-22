'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '../../../../../lib/supabase/client';

const numQuestions = 21;

const questions = [
  "Sadness", "Pessimism", "Past Failure", "Loss of Pleasure",
  "Guilty Feelings", "Punishment Feelings", "Self-Dislike",
  "Self-Criticalness", "Suicidal Thoughts or Wishes",
  "Crying", "Agitation", "Loss of Interest",
  "Indecisiveness", "Worthlessness", "Loss of Energy",
  "Changes in Sleeping Pattern", "Irritability",
  "Changes in Appetite", "Concentration Difficulty",
  "Tiredness or Fatigue", "Loss of Interest in Sex"
];

const mcq = [
  ["I do not feel sad.", "I feel sad much of the time.", "I am sad all the time.", "I am so sad or unhappy that I can't stand it."],
  ["I am not discouraged about my future.", "I feel more discouraged about my future than I used to.", "I do not expect things to work out for me.", "I feel my future is hopeless and will only get worse."],
  ["I do not feel like a failure.", "I have failed more than I should have.", "As I look back, I see a lot of failures.", "I feel I am a total failure as a person."],
  ["I get as much pleasure as I ever did from the things I enjoy.", "I don't enjoy things as much as I used to.", "I get very little pleasure from the things I used to enjoy.", "I can't get any pleasure from the things I used to enjoy."],
  ["I don't feel particularly guilty.", "I feel guilty over many things I have done or should have done.", "I feel quite guilty most of the time.", "I feel guilty all the time."],
  ["I don't feel I am being punished.", "I feel I may be punished.", "I expect to be punished.", "I feel I am being punished."],
  ["I feel the same about myself as ever.", "I have lost confidence in myself.", "I am disappointed in myself.", "I dislike myself."],
  ["I don't criticize or blame myself more than usual.", "I am more critical of myself than I used to be.", "I criticize myself for all of my faults.", "I blame myself for everything bad that happens."],
  ["I don't have any thoughts of killing myself.", "I have thoughts of killing myself, but I would not carry them out.", "I would like to kill myself.", "I would kill myself if I had the chance."],
  ["I don't cry any more than I used to.", "I cry more than I used to.", "I cry over every little thing.", "I feel like crying, but I can't."],
  ["I am no more restless or wound up than usual.", "I feel more restless or wound up than usual.", "I am so restless or agitated it's hard to stay still.", "I am so restless or agitated I have to keep moving or doing something."],
  ["I have not lost interest in other people or activities.", "I am less interested in other people or things than before.", "I have lost most of my interest in other people or things.", "It's hard to get interested in anything."],
  ["I make decisions about as well as ever.", "I find it more difficult to make decisions than usual.", "I have much greater difficulty in making decisions than I used to.", "I have trouble making any decisions."],
  ["I do not feel I am worthless.", "I don't consider myself as worthwhile and useful as I used to.", "I feel more worthless compared to others.", "I feel utterly worthless."],
  ["I have as much energy as ever.", "I have less energy than I used to have.", "I don't have enough energy to do very much.", "I don't have enough energy to do anything."],
  ["I have not experienced any change in my sleeping.", "I sleep somewhat more than usual.", "I sleep a lot less than usual.", "I wake up 1-2 hours early and can't get back to sleep."],
  ["I am not more irritable than usual.", "I am more irritable than usual.", "I am much more irritable than usual.", "I am irritable all the time."],
  ["I have not experienced any change in my appetite.", "My appetite is somewhat less than usual.", "My appetite is much less than before.", "I crave food all the time."],
  ["I can concentrate as well as ever.", "I can't concentrate as well as usual.", "It's hard to keep my mind on anything for long.", "I find I can't concentrate on anything."],
  ["I am no more tired or fatigued than usual.", "I get tired or fatigued more easily than usual.", "I am too tired or fatigued to do a lot of the things I used to do.", "I am too tired or fatigued to do most of the things I used to do."],
  ["I have not noticed any recent change in my interest in sex.", "I am less interested in sex than I used to be.", "I am much less interested in sex now.", "I have lost interest in sex completely."]
];

const bdiGrading = [
  { range: [0, 13], level: 'Minimal depression' },
  { range: [14, 19], level: 'Mild depression' },
  { range: [20, 28], level: 'Moderate depression' },
  { range: [29, 63], level: 'Severe depression' }
];

export default function BdiPage() {
  const [testStarted, setTestStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { user, userId } = useAuth();
  

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers({ ...answers, [questionIndex]: parseInt(value) });
  };

  const handleSubmit = async () => {
    const totalScore = Object.values(answers).reduce((sum, answer) => sum + answer, 0);
    setScore(totalScore);

    if (!user) {
      alert('You must be logged in to save your results.');
      return;
    }

    const { error } = await supabase
      .from('bdi_history')
      .insert([{ user_id: userId, bdi_score: totalScore }]);

    if (error) {
      console.error('Error saving BDI score:', error.message);
      alert(`Failed to save score: ${error.message}`);
    } else {
      console.log('BDI score saved successfully!');
    }

    setShowResult(true);
  };

  const getDepressionLevel = (totalScore: number) => {
    for (const grade of bdiGrading) {
      if (totalScore >= grade.range[0] && totalScore <= grade.range[1]) {
        return grade.level;
      }
    }
    return 'Unknown level';
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-headline font-semibold mb-6">Beck Depression Inventory (BDI)</h1>

      {!testStarted && !showResult && (
        <div className="space-y-4">
          <p>This is the Beck Depression Inventory (BDI), a questionnaire to assess depressive symptom severity.</p>
          <p>There are {numQuestions} questions. For each, choose the statement that best describes how you’ve been feeling over the past two weeks.</p>
          <Button onClick={() => setTestStarted(true)}>Begin Test</Button>
        </div>
      )}

      {testStarted && !showResult && (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="border p-4 rounded-md">
              <p className="font-medium mb-2">{`${index + 1}. ${question}`}</p>
              <RadioGroup onValueChange={(value) => handleAnswerChange(index, value)}>
                {mcq[index].map((option, i) => (
                  <div className="flex items-center space-x-2" key={i}>
                    <RadioGroupItem value={i.toString()} id={`q${index}-${i}`} />
                    <Label htmlFor={`q${index}-${i}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== numQuestions}
          >
            Submit
          </Button>
        </div>
      )}

      {showResult && score !== null && (
        <div className="space-y-4">
          <h2 className="text-2xl font-headline font-medium">Test Results</h2>
          <p>Your total score is: <span className="font-semibold">{score}</span></p>
          <p>Based on your score, your depression level is: <span className="font-semibold">{getDepressionLevel(score)}</span></p>
        </div>
      )}
    </div>
  );
}