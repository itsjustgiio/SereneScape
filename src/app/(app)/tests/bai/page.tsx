'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '../../../../../lib/supabase/client';

const NUM_QUESTIONS = 21;

const questions = [
  "Have you had any feeling of numbness or tingling?",
  "Have you been feeling hot?",
  "Have you been feeling wobbliness in the legs?",
  "Have you been unable to relax?",
  "Have you been in fear of the worst happening?",
  "Has your heart been pounding / racing?",
  "Have you been feeling unsteady?",
  "Have you been feeling terrified or afraid?",
  "Have you been feeling nervous?",
  "Have you experienced feelings of choking lately?",
  "Do you experience frequent hand trembling?",
  "Do you feel shaky at times?",
  "Do you have a fear of losing control?",
  "Have you had difficulty in breathing?",
  "Do you have fears of dying?",
  "Are you scared?",
  "Have you been experiencing indigestion?",
  "Have you been feeling lightheaded or like you might faint?",
  "Do you experience face flushing?",
  "Have you had the cold sweats?",
  "Do you experience unusual dizziness?"
];

export default function BaiPage() {
  const [showTest, setShowTest] = useState(false);
  const [answers, setAnswers] = useState<number[]>(Array(NUM_QUESTIONS).fill(-1));
  const [showResult, setShowResult] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [anxietyLevel, setAnxietyLevel] = useState('');
  
  const { user, userId } = useAuth();
  

  const handleBeginTest = () => {
    setShowTest(true);
    setShowResult(false);
    setAnswers(Array(NUM_QUESTIONS).fill(-1)); // Reset answers
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = parseInt(value, 10);
    setAnswers(newAnswers);
  };

  const handleSubmitTest = async () => {
    const score = answers.reduce((sum, answer) => sum + (answer > -1 ? answer : 0), 0);
    setTotalScore(score);

    if (!user) {
      alert('You must be logged in to save your results.');
      return;
    }

    const { error } = await supabase
      .from('bai_scores')
      .insert([{ user_id: userId, bai_score: score }]);

    if (error) {
      console.error('Error saving score:', error.message);
      alert(`Failed to save score: ${error.message}`);
    } else {
      console.log('BAI score saved successfully!');
    }

    if (score <= 21) {
      setAnxietyLevel('Low Anxiety');
    } else if (score <= 35) {
      setAnxietyLevel('Moderate Anxiety');
    } else {
      setAnxietyLevel('Potentially Concerning Levels of Anxiety');
    }

    setShowTest(false);
    setShowResult(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Beck Anxiety Inventory (BAI)</h1>

      {!showTest && !showResult && (
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>About the BAI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>The Beck Anxiety Inventory (BAI) is a 21-question survey designed to measure the severity of anxiety symptoms.</p>
            <p>For each question, select how much you’ve been bothered by the symptom over the past week:</p>
            <ul>
              <li><strong>0:</strong> Not at all</li>
              <li><strong>1:</strong> Mildly</li>
              <li><strong>2:</strong> Moderately</li>
              <li><strong>3:</strong> Severely</li>
            </ul>
            <div className="text-center">
              <Button onClick={handleBeginTest}>Begin Test</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showTest && (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <p className="mb-4 font-semibold">{`${index + 1}. ${question}`}</p>
                <RadioGroup
                  onValueChange={(value) => handleAnswerChange(index, value)}
                  value={answers[index] !== -1 ? answers[index].toString() : undefined}
                  className="flex flex-col space-y-2"
                >
                  {[0, 1, 2, 3].map((val) => (
                    <div className="flex items-center space-x-2" key={val}>
                      <RadioGroupItem value={val.toString()} id={`q${index}-${val}`} />
                      <Label htmlFor={`q${index}-${val}`}>
                        {`${val} - ${
                          val === 0
                            ? 'Not at all'
                            : val === 1
                            ? 'Mildly'
                            : val === 2
                            ? 'Moderately'
                            : 'Severely'
                        }`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
          <div className="text-center mt-8">
            <Button
              onClick={handleSubmitTest}
              disabled={answers.some((answer) => answer === -1)}
            >
              Submit Test
            </Button>
          </div>
        </div>
      )}

      {showResult && (
        <Card className="mx-auto max-w-2xl text-center">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xl font-semibold">Your total score is: {totalScore}</p>
            <p className="text-lg">Anxiety Level: <span className="font-bold">{anxietyLevel}</span></p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}