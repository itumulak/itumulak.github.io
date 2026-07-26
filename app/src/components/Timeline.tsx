import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { ICONS, type IconName } from './icons';

export interface ExperienceEntry {
  title: string;
  position: string;
  dateRange: string;
  description: string;
  workLabel?: string;
  pills?: { name: string; url: string }[];
  icon?: IconName;
}

export interface TimelineProps {
  experience: ExperienceEntry[];
}

export function Timeline({ experience }: TimelineProps) {
  return (
    <VerticalTimeline lineColor="var(--color-light-dark)">
      {experience.map((entry) => {
        const Icon = ICONS[entry.icon ?? 'briefcase'];
        return (
          <VerticalTimelineElement
            key={`${entry.title}-${entry.dateRange}`}
            contentStyle={{ background: 'var(--color-light-dark)', color: 'var(--color-text)' }}
            contentArrowStyle={{ borderRight: '7px solid var(--color-light-dark)' }}
            date={entry.dateRange}
            dateClassName="text-text"
            iconStyle={{ background: 'var(--color-brand)', color: 'var(--color-bg)' }}
            icon={<Icon />}
          >
            <h3 className="text-text text-lg font-bold">{entry.position}</h3>
            <h4 className="text-brand font-semibold">{entry.title}</h4>
            <p className="text-text/80 mt-2">{entry.description}</p>
            {entry.workLabel && entry.pills && entry.pills.length > 0 && (
              <div className="mt-3 flex flex-col gap-y-2">
                <span className="text-text/70 text-sm">{entry.workLabel}</span>
                <ul className="flex flex-wrap gap-2">
                  {entry.pills.map((pill) => (
                    <li key={pill.url}>
                      <a
                        href={pill.url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-brand-dark text-text inline-block rounded px-3 py-1 text-sm"
                      >
                        {pill.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </VerticalTimelineElement>
        );
      })}
    </VerticalTimeline>
  );
}
