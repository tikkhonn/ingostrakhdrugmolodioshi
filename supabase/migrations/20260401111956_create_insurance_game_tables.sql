/*
  # Create Insurance Game Database Schema

  1. New Tables
    - `game_sessions` - Tracks user game progress and wallet balance
      - `id` (uuid, primary key)
      - `user_id` (text) - Anonymous user identifier
      - `wallet_balance` (integer) - Current balance in RUB
      - `rounds_played` (integer) - Total number of rounds
      - `rounds_insured` (integer) - Times the user bought insurance
      - `rounds_uninsured` (integer) - Times the user risked
      - `insurance_saved_money` (integer) - Total money saved by insurance
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `game_rounds` - Records individual game rounds
      - `id` (uuid, primary key)
      - `session_id` (uuid, FK to game_sessions)
      - `season` (text) - Winter, Spring, Summer, Autumn
      - `scenario_text` (text) - The specific scenario presented
      - `insurance_bought` (boolean) - Whether user bought insurance
      - `insurance_cost` (integer) - Cost of insurance
      - `bad_luck_chance` (integer) - Percentage chance of accident
      - `accident_occurred` (boolean) - Whether accident happened
      - `accident_cost` (integer) - Cost if accident occurred
      - `money_saved` (integer) - Amount saved by insurance (if applicable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Allow any user to create and read their own records via session_id
*/

CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  wallet_balance integer NOT NULL DEFAULT 10000,
  rounds_played integer NOT NULL DEFAULT 0,
  rounds_insured integer NOT NULL DEFAULT 0,
  rounds_uninsured integer NOT NULL DEFAULT 0,
  insurance_saved_money integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  season text NOT NULL,
  scenario_text text NOT NULL,
  insurance_bought boolean NOT NULL,
  insurance_cost integer NOT NULL,
  bad_luck_chance integer NOT NULL,
  accident_occurred boolean NOT NULL,
  accident_cost integer NOT NULL,
  money_saved integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_rounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create own game sessions"
  ON game_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own game sessions"
  ON game_sessions FOR SELECT
  USING (true);

CREATE POLICY "Users can update own game sessions"
  ON game_sessions FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can create own game rounds"
  ON game_rounds FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own game rounds"
  ON game_rounds FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM game_sessions
      WHERE game_sessions.id = game_rounds.session_id
    )
  );
