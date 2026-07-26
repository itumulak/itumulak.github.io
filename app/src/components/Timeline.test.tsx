import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timeline, type ExperienceEntry } from './Timeline';

describe('Timeline', () => {
  it('renders each entry’s position, company, description, and date range', () => {
    const experience: ExperienceEntry[] = [
      {
        title: 'Acme Corp',
        position: 'Engineer',
        dateRange: '2020 - Present',
        description: 'Did engineering things.',
      },
    ];
    render(<Timeline experience={experience} />);

    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Did engineering things.')).toBeInTheDocument();
    expect(screen.getByText('2020 - Present')).toBeInTheDocument();
  });

  it('renders every entry when given more than one', () => {
    const experience: ExperienceEntry[] = [
      { title: 'Acme Corp', position: 'Engineer', dateRange: '2020 - 2022', description: 'A' },
      {
        title: 'Other Co',
        position: 'Senior Engineer',
        dateRange: '2022 - Present',
        description: 'B',
      },
    ];
    render(<Timeline experience={experience} />);

    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Other Co')).toBeInTheDocument();
  });

  it('renders the work-with pills when workLabel and pills are both provided', () => {
    const experience: ExperienceEntry[] = [
      {
        title: 'Acme Corp',
        position: 'Engineer',
        dateRange: '2020 - Present',
        description: 'Did things.',
        workLabel: 'Worked with',
        pills: [{ name: 'TypeScript', url: 'https://typescriptlang.org' }],
      },
    ];
    render(<Timeline experience={experience} />);

    expect(screen.getByText('Worked with')).toBeInTheDocument();
    const pill = screen.getByRole('link', { name: 'TypeScript' });
    expect(pill).toHaveAttribute('href', 'https://typescriptlang.org');
  });

  it('does not render a work-with block when pills are omitted', () => {
    const experience: ExperienceEntry[] = [
      {
        title: 'Acme Corp',
        position: 'Engineer',
        dateRange: '2020 - Present',
        description: 'Did things.',
      },
    ];
    render(<Timeline experience={experience} />);

    expect(screen.queryByText('Worked with')).not.toBeInTheDocument();
  });

  it('does not render a work-with block when pills is an empty array', () => {
    const experience: ExperienceEntry[] = [
      {
        title: 'Acme Corp',
        position: 'Engineer',
        dateRange: '2020 - Present',
        description: 'Did things.',
        workLabel: 'Worked with',
        pills: [],
      },
    ];
    render(<Timeline experience={experience} />);

    expect(screen.queryByText('Worked with')).not.toBeInTheDocument();
  });

  it('does not throw when an entry omits icon (falls back to a default)', () => {
    const experience: ExperienceEntry[] = [
      { title: 'Acme Corp', position: 'Engineer', dateRange: '2020', description: 'Did things.' },
    ];
    expect(() => render(<Timeline experience={experience} />)).not.toThrow();
  });

  it('renders nothing when experience is empty', () => {
    render(<Timeline experience={[]} />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
