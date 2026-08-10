import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import type { Scenario } from "./types";
import { COMPONENTS, STUDY_DEFAULTS } from "./data/components";
import { simulate, solveContribution } from "./lib/simulate";
import { readScenarioFromLocation, writeScenarioToLocation } from "./lib/urlState";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TimelineChart from "./components/TimelineChart";
import LeverPanel from "./components/LeverPanel";
import OutcomeCards from "./components/OutcomeCards";
import BreakdownChart from "./components/BreakdownChart";
import ComponentTable from "./components/ComponentTable";
import Footer from "./components/Footer";

type Action =
  | { type: "set"; patch: Partial<Scenario> }
  | { type: "preset"; scenario: Scenario }
  | { type: "reset" };

function reducer(state: Scenario, action: Action): Scenario {
  switch (action.type) {
    case "set":
      return { ...state, ...action.patch };
    case "preset":
      return { ...action.scenario };
    case "reset":
      return { ...STUDY_DEFAULTS };
    default:
      return state;
  }
}

export default function App() {
  const [scenario, dispatch] = useReducer(reducer, undefined, readScenarioFromLocation);
  const debounceRef = useRef<number | undefined>(undefined);

  // Debounced URL sync: replace the URL 200ms after the last change.
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      writeScenarioToLocation(scenario);
    }, 200);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [scenario]);

  const results = useMemo(() => simulate(scenario, COMPONENTS), [scenario]);

  const breakEvenContribution = useMemo(
    () =>
      solveContribution(
        { ...scenario, annualContribution: 0 },
        { kind: "break-even" },
        COMPONENTS,
      ),
    [scenario],
  );

  const onApplyBreakEven = useCallback(() => {
    dispatch({
      type: "set",
      patch: {
        annualContribution: breakEvenContribution,
      },
    });
  }, [breakEvenContribution]);

  return (
    <div className="app">
      <Header onReset={() => dispatch({ type: "reset" })} />
      <Hero scenario={scenario} results={results} breakEvenContribution={breakEvenContribution} onApplyBreakEven={onApplyBreakEven} />
      <TimelineChart results={results} />
      <LeverPanel scenario={scenario} dispatch={dispatch} breakEvenContribution={breakEvenContribution} />
      <OutcomeCards results={results} scenario={scenario} breakEvenContribution={breakEvenContribution} />
      <BreakdownChart results={results} />
      <ComponentTable />
      <Footer />
    </div>
  );
}
