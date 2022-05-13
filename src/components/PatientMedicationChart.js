import React from 'react';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const MINUTES_PER_DAY = 60 * 24;
const Timing = {
  prescribed: 'prescribed',
  correct: 'correct',
  notIdeal: 'notIdeal',
  incorrect: 'incorrect',
};
const ColorByTiming = {
  [Timing.prescribed]: '#79A6A3',
  [Timing.correct]: '#96B83D',
  [Timing.notIdeal]: 'gold',
  [Timing.incorrect]: 'red',
};

const mockMedications = [
  {
    date: '05/02',
    sessionHistory: [
      {
        expected: {
          startTime: '5/2/2022, 5:00 AM',
          endTime: '5/2/2022, 8:00 AM',
        },
        actual: {
          startTime: '5/2/2022, 5:00 AM',
          endTime: '5/2/2022, 8:00 AM',
        },
        sessionStatus: Timing.correct,
      },
      {
        expected: {
          startTime: '5/2/2022, 1:00 PM',
          endTime: '5/2/2022, 4:00 PM',
        },
        actual: {
          startTime: '5/2/2022, 2:00 PM',
          endTime: '5/2/2022, 4:00 PM',
        },
        sessionStatus: Timing.correct,
      },
      {
        expected: {
          startTime: '5/2/2022, 8:00 PM',
          endTime: '5/2/2022, 11:00 PM',
        },
        actual: {
          startTime: '5/2/2022, 10:00 PM',
          endTime: '5/2/2022, 11:30 PM',
        },
        sessionStatus: Timing.notIdeal,
      },
    ],
  },
  {
    date: '05/03',
    sessionHistory: [
      {
        expected: {
          startTime: '5/3/2022, 3:00 AM',
          endTime: '5/3/2022, 6:00 AM',
        },
        actual: {
          startTime: '5/3/2022, 5:00 AM',
          endTime: '5/3/2022, 8:00 AM',
        },
        sessionStatus: Timing.notIdeal,
      },
      {
        expected: {
          startTime: '5/3/2022, 11:00 AM',
          endTime: '5/3/2022, 2:00 PM',
        },
        actual: {
          startTime: '5/3/2022, 3:00 PM',
          endTime: '5/3/2022, 5:00 PM',
        },
        sessionStatus: Timing.incorrect,
      },
      {
        expected: {
          startTime: '5/3/2022, 7:00 PM',
          endTime: '5/3/2022, 10:00 PM',
        },
        actual: {
          startTime: '5/3/2022, 10:00 PM',
          endTime: '5/3/2022, 11:00 PM',
        },
        sessionStatus: Timing.notIdeal,
      },
    ],
  },
  {
    date: '05/04',
    sessionHistory: [
      {
        expected: {
          startTime: '5/4/2022, 4:00 AM',
          endTime: '5/4/2022, 9:00 AM',
        },
        actual: {
          startTime: '5/4/2022, 4:00 AM',
          endTime: '5/4/2022, 9:00 AM',
        },
        sessionStatus: Timing.correct,
      },
      {
        expected: {
          startTime: '5/4/2022, 10:00 AM',
          endTime: '5/4/2022, 2:00 PM',
        },
        actual: {
          startTime: '5/4/2022, 10:00 AM',
          endTime: '5/4/2022, 2:00 PM',
        },
        sessionStatus: Timing.correct,
      },
      {
        expected: {
          startTime: '5/4/2022, 6:00 PM',
          endTime: '5/4/2022, 10:00 PM',
        },
        actual: {
          startTime: '5/4/2022, 7:00 PM',
          endTime: '5/4/2022, 11:00 PM',
        },
        sessionStatus: Timing.correct,
      },
    ],
  },
  {
    date: '05/05',
    sessionHistory: [
      {
        expected: {
          startTime: '5/5/2022, 5:00 AM',
          endTime: '5/5/2022, 8:00 AM',
        },
        actual: {
          startTime: '5/5/2022, 5:00 AM',
          endTime: '5/5/2022, 8:00 AM',
        },
        sessionStatus: Timing.correct,
      },
      {
        expected: {
          startTime: '5/5/2022, 1:00 PM',
          endTime: '5/5/2022, 4:00 PM',
        },
        actual: {
          startTime: '5/5/2022, 3:00 PM',
          endTime: '5/5/2022, 5:00 PM',
        },
        sessionStatus: Timing.notIdeal,
      },
      {
        expected: {
          startTime: '5/5/2022, 8:00 PM',
          endTime: '5/5/2022, 11:00 PM',
        },
        actual: {
          startTime: '5/5/2022, 10:00 PM',
          endTime: '5/5/2022, 11:30 PM',
        },
        sessionStatus: Timing.notIdeal,
      },
    ],
  },
  {
    date: '05/06',
    sessionHistory: [
      {
        expected: {
          startTime: '5/6/2022, 5:00 AM',
          endTime: '5/6/2022, 8:00 AM',
        },
        actual: {
          startTime: '5/6/2022, 5:00 AM',
          endTime: '5/6/2022, 8:00 AM',
        },
        sessionStatus: Timing.correct,
      },
      {
        expected: {
          startTime: '5/6/2022, 1:00 PM',
          endTime: '5/6/2022, 4:00 PM',
        },
        actual: {
          startTime: '5/6/2022, 3:00 PM',
          endTime: '5/6/2022, 5:00 PM',
        },
        sessionStatus: Timing.notIdeal,
      },
      {
        expected: {
          startTime: '5/6/2022, 8:00 PM',
          endTime: '5/6/2022, 11:00 PM',
        },
        actual: {
          startTime: '5/6/2022, 10:00 PM',
          endTime: '5/6/2022, 11:30 PM',
        },
        sessionStatus: Timing.notIdeal,
      },
    ],
  },
  {
    date: '05/07',
    sessionHistory: [
      {
        expected: {
          startTime: '5/7/2022, 3:00 AM',
          endTime: '5/7/2022, 5:00 AM',
        },
        actual: {
          startTime: '5/7/2022, 3:30 AM',
          endTime: '5/7/2022, 5:00 AM',
        },
        sessionStatus: Timing.notIdeal,
      },
      {
        expected: {
          startTime: '5/7/2022, 1:00 PM',
          endTime: '5/7/2022, 4:00 PM',
        },
        actual: {
          startTime: '5/7/2022, 3:00 PM',
          endTime: '5/7/2022, 5:00 PM',
        },
        sessionStatus: Timing.notIdeal,
      },
      {
        expected: {
          startTime: '5/7/2022, 8:00 PM',
          endTime: '5/7/2022, 11:00 PM',
        },
        actual: {
          startTime: '5/7/2022, 10:00 PM',
          endTime: '5/7/2022, 11:30 PM',
        },
        sessionStatus: Timing.notIdeal,
      },
    ],
  },
  {
    date: '05/08',
    sessionHistory: [
      {
        expected: {
          startTime: '5/8/2022, 2:00 AM',
          endTime: '5/8/2022, 5:00 AM',
        },
        actual: {
          startTime: '5/8/2022, 2:00 AM',
          endTime: '5/8/2022, 5:00 AM',
        },
        sessionStatus: Timing.correct,
      },
      {
        expected: {
          startTime: '5/8/2022, 1:00 PM',
          endTime: '5/8/2022, 4:00 PM',
        },
        actual: {
          startTime: '5/8/2022, 3:00 PM',
          endTime: '5/8/2022, 5:00 PM',
        },
        sessionStatus: Timing.notIdeal,
      },
      {
        expected: {
          startTime: '5/8/2022, 8:00 PM',
          endTime: '5/8/2022, 11:00 PM',
        },
        actual: {
          startTime: '5/8/2022, 10:00 PM',
          endTime: '5/8/2022, 11:30 PM',
        },
        sessionStatus: Timing.notIdeal,
      },
    ],
  },
];

const PatientMedicationChart = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2.5rem auto',
        gridTemplateRows: '3rem auto 3rem',
        gridTemplateAreas: '". legends" "yLabels board" ". xLabels"',
      }}
    >
      <Legends />
      <YAxisLabels />
      <div
        style={{
          gridArea: 'board',
          borderTopWidth: 0,
          borderRightWidth: 0,
          borderBottomWidth: 2,
          borderLeftWidth: 2,
          borderStyle: 'solid',
          borderColor: '#e5e7eb',
          display: 'grid',
          gridAutoFlow: 'column',
        }}
      >
        {mockMedications.map(({ date, sessionHistory }) => (
          <Day key={date} sessionHistory={sessionHistory} />
        ))}
      </div>
      <XAxisLabels medications={mockMedications} />
    </div>
  );
};

const Rect = ({ color }) => (
  <div
    style={{
      width: '0.75rem',
      height: 0,
      borderRadius: 2,
      borderColor: color,
      borderStyle: 'solid',
      borderTopWidth: '0.25rem',
      borderBottomWidth: '0.25rem',
    }}
  />
);

const Legends = () => (
  <div
    id="legends"
    style={{
      gridArea: 'legends',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      columnGap: '1.5rem',
      paddingRight: '1rem',
      paddingBottom: '1rem',
      flexWrap: 'wrap',
      fontSize: '0.8rem',
    }}
  >
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      <Rect color={ColorByTiming[Timing.prescribed]} />
      <span className="ml-2">Prescribed</span>
    </div>
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      <Rect color={ColorByTiming[Timing.correct]} />
      <span className="ml-2">Correct Usage</span>
    </div>
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      <Rect color={ColorByTiming[Timing.notIdeal]} />
      <span className="ml-2">Not Ideal</span>
    </div>
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      <Rect color={ColorByTiming[Timing.incorrect]} />
      <span className="ml-2">Incorrect Usage</span>
    </div>
  </div>
);

const XAxisLabels = ({ medications = [] }) => (
  <div
    id="x-axis-labels"
    style={{ gridArea: 'xLabels', display: 'grid', gridAutoFlow: 'column' }}
  >
    {medications.map(({ date, sessionHistory }) => {
      let idealPoint = 0;
      let actualPoint = 0;
      for (const session of sessionHistory) {
        idealPoint += 2;
        if (session.sessionStatus === Timing.correct) {
          actualPoint += 2;
        } else if (session.sessionStatus === Timing.notIdeal) {
          actualPoint += 1;
        }
      }
      return (
        <div
          key={date}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{date}</div>
          <small style={{}}>{`${idealPoint}/${actualPoint}`}</small>
        </div>
      );
    })}
  </div>
);

const YAxisLabels = () => (
  <div
    id="y-axis-labels"
    style={{
      gridArea: 'yLabels',
      display: 'grid',
      gridAutoFlow: 'row',
    }}
  >
    {Array.from({ length: 25 }, (_, i) => (
      <div
        key={i}
        id="y-axis-label"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '0.75rem',
        }}
      >
        {24 - i}
      </div>
    ))}
  </div>
);

const Expected = ({ startTime, endTime }) => {
  const endMinutes =
    new Date(endTime).getHours() * 60 + new Date(endTime).getMinutes();
  const totalMinutes =
    (new Date(endTime).getTime() - new Date(startTime).getTime()) / MINUTE;
  const height = `${(totalMinutes / MINUTES_PER_DAY) * 100}%`;
  const top = `${((MINUTES_PER_DAY - endMinutes) / MINUTES_PER_DAY) * 100}%`;
  return (
    <div
      style={{
        position: 'absolute',
        height,
        top,
        left: 'calc(50% - 0.625rem)',
        width: 0,
        borderColor: ColorByTiming[Timing.prescribed],
        borderStyle: 'solid',
        borderLeftWidth: '0.25rem',
        borderRightWidth: '0.25rem',
      }}
    />
  );
};

const Actual = ({ startTime, endTime, timing }) => {
  const endMinutes =
    new Date(endTime).getHours() * 60 + new Date(endTime).getMinutes();
  const totalMinutes =
    (new Date(endTime).getTime() - new Date(startTime).getTime()) / MINUTE;
  const height = `${(totalMinutes / MINUTES_PER_DAY) * 100}%`;
  const top = `${((MINUTES_PER_DAY - endMinutes) / MINUTES_PER_DAY) * 100}%`;
  return (
    <div
      style={{
        position: 'absolute',
        height,
        top,
        left: 'calc(50% + 0.125rem)',
        width: 0,
        borderColor: ColorByTiming[timing],
        borderStyle: 'solid',
        borderLeftWidth: '0.25rem',
        borderRightWidth: '0.25rem',
      }}
    />
  );
};

const Day = ({ sessionHistory = [] }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {sessionHistory.map(({ expected, actual, sessionStatus }, i) => {
        return (
          <React.Fragment key={i}>
            <Expected
              startTime={expected.startTime}
              endTime={expected.endTime}
            />
            <Actual
              startTime={actual.startTime}
              endTime={actual.endTime}
              timing={sessionStatus}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default PatientMedicationChart;
