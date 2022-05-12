import React from 'react';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const MINUTES_PER_DAY = 60 * 24;
const Timing = { good: 'good', warn: 'warn', invalid: 'invalid' };
const ColorByTiming = {
  [Timing.good]: 'rgb(50, 205, 50, 0.75)',
  [Timing.warn]: 'rgb(255, 200, 0, 0.75)',
  [Timing.invalid]: 'rgb(255, 69, 0, 0.75)',
};

const mockMedications = [
  {
    date: '05/02',
    medicationResults: [
      {
        expected: {
          startTime: '5/2/2022, 5:00 AM',
          endTime: '5/2/2022, 8:00 AM',
        },
        actual: {
          startTime: '5/2/2022, 5:00 AM',
          endTime: '5/2/2022, 8:00 AM',
        },
      },
      {
        expected: {
          startTime: '5/2/2022, 1:00 PM',
          endTime: '5/2/2022, 4:00 PM',
        },
        actual: {
          startTime: '5/2/2022, 3:00 PM',
          endTime: '5/2/2022, 5:00 PM',
        },
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
      },
    ],
  },
  {
    date: '05/03',
    medicationResults: [
      {
        expected: {
          startTime: '5/3/2022, 3:00 AM',
          endTime: '5/3/2022, 6:00 AM',
        },
        actual: {
          startTime: '5/3/2022, 5:00 AM',
          endTime: '5/3/2022, 8:00 AM',
        },
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
      },
    ],
  },
  {
    date: '05/04',
    medicationResults: [
      {
        expected: {
          startTime: '5/4/2022, 4:00 AM',
          endTime: '5/4/2022, 9:00 AM',
        },
        actual: {
          startTime: '5/4/2022, 4:00 AM',
          endTime: '5/4/2022, 9:00 AM',
        },
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
      },
    ],
  },
  {
    date: '05/05',
    medicationResults: [
      {
        expected: {
          startTime: '5/5/2022, 5:00 AM',
          endTime: '5/5/2022, 8:00 AM',
        },
        actual: {
          startTime: '5/5/2022, 5:00 AM',
          endTime: '5/5/2022, 8:00 AM',
        },
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
      },
    ],
  },
  {
    date: '05/06',
    medicationResults: [
      {
        expected: {
          startTime: '5/6/2022, 5:00 AM',
          endTime: '5/6/2022, 8:00 AM',
        },
        actual: {
          startTime: '5/6/2022, 5:00 AM',
          endTime: '5/6/2022, 8:00 AM',
        },
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
      },
    ],
  },
  {
    date: '05/07',
    medicationResults: [
      {
        expected: {
          startTime: '5/7/2022, 3:00 AM',
          endTime: '5/7/2022, 5:00 AM',
        },
        actual: {
          startTime: '5/7/2022, 3:30 AM',
          endTime: '5/7/2022, 5:00 AM',
        },
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
      },
    ],
  },
  {
    date: '05/08',
    medicationResults: [
      {
        expected: {
          startTime: '5/8/2022, 2:00 AM',
          endTime: '5/8/2022, 5:00 AM',
        },
        actual: {
          startTime: '5/8/2022, 2:00 AM',
          endTime: '5/8/2022, 5:00 AM',
        },
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
      },
    ],
  },
  {
    date: '05/09',
    medicationResults: [
      {
        expected: {
          startTime: '5/9/2022, 6:00 AM',
          endTime: '5/9/2022, 9:00 AM',
        },
        actual: {
          startTime: '5/9/2022, 7:00 AM',
          endTime: '5/9/2022, 9:00 AM',
        },
      },
      {
        expected: {
          startTime: '5/9/2022, 1:00 PM',
          endTime: '5/9/2022, 4:00 PM',
        },
        actual: {
          startTime: '5/9/2022, 3:00 PM',
          endTime: '5/9/2022, 5:00 PM',
        },
      },
      {
        expected: {
          startTime: '5/9/2022, 8:00 PM',
          endTime: '5/9/2022, 11:00 PM',
        },
        actual: {
          startTime: '5/9/2022, 10:00 PM',
          endTime: '5/9/2022, 11:30 PM',
        },
      },
    ],
  },
  {
    date: '05/10',
    medicationResults: [
      {
        expected: {
          startTime: '5/10/2022, 5:00 AM',
          endTime: '5/10/2022, 8:00 AM',
        },
        actual: {
          startTime: '5/10/2022, 5:00 AM',
          endTime: '5/10/2022, 8:00 AM',
        },
      },
      {
        expected: {
          startTime: '5/10/2022, 1:00 PM',
          endTime: '5/10/2022, 4:00 PM',
        },
        actual: {
          startTime: '5/10/2022, 3:00 PM',
          endTime: '5/10/2022, 5:00 PM',
        },
      },
      {
        expected: {
          startTime: '5/10/2022, 8:00 PM',
          endTime: '5/10/2022, 11:00 PM',
        },
        actual: {
          startTime: '5/10/2022, 9:00 PM',
          endTime: '5/10/2022, 10:00 PM',
        },
      },
    ],
  },
  {
    date: '05/11',
    medicationResults: [
      {
        expected: {
          startTime: '5/11/2022, 6:00 AM',
          endTime: '5/11/2022, 9:00 AM',
        },
        actual: {
          startTime: '5/11/2022, 7:30 AM',
          endTime: '5/11/2022, 9:30 AM',
        },
      },
      {
        expected: {
          startTime: '5/11/2022, 1:30 PM',
          endTime: '5/11/2022, 4:30 PM',
        },
        actual: {
          startTime: '5/11/2022, 3:30 PM',
          endTime: '5/11/2022, 5:30 PM',
        },
      },
      {
        expected: {
          startTime: '5/11/2022, 9:00 PM',
          endTime: '5/11/2022, 11:00 PM',
        },
        actual: {
          startTime: '5/11/2022, 10:30 PM',
          endTime: '5/11/2022, 11:30 PM',
        },
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
        gridTemplateRows: 'auto 2.5rem',
        gridTemplateAreas: '"yLabels board" ". xLabels"',
      }}
    >
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
        {mockMedications.map(({ date, medicationResults }) => (
          <Day key={date} medicationResults={medicationResults} />
        ))}
      </div>
      <div
        id="x-axis-labels"
        style={{ gridArea: 'xLabels', display: 'grid', gridAutoFlow: 'column' }}
      >
        {mockMedications.map(({ date }) => (
          <div
            key={date}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
            }}
          >
            {date}
          </div>
        ))}
      </div>
    </div>
  );
};

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
        left: '25%',
        width: '20%',
        backgroundColor: 'rgba(0, 191, 255, 0.75)',
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
        left: '55%',
        width: '20%',
        backgroundColor: ColorByTiming[timing],
      }}
    />
  );
};

const Day = ({ medicationResults = [] }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {medicationResults.map(({ expected, actual }, i) => {
        let timing;
        const delay =
          new Date(actual.startTime).getTime() -
          new Date(expected.startTime).getTime();
        if (delay >= 4 * HOUR) {
          timing = Timing.invalid;
        } else if (delay >= 2 * HOUR) {
          timing = Timing.warn;
        } else {
          timing = Timing.good;
        }
        return (
          <React.Fragment key={i}>
            <Expected
              startTime={expected.startTime}
              endTime={expected.endTime}
            />
            <Actual
              startTime={actual.startTime}
              endTime={actual.endTime}
              timing={timing}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default PatientMedicationChart;
