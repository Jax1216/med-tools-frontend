import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Practice from './Practice';

const click = (el) => fireEvent.click(el);
const type = (el, value) => fireEvent.change(el, { target: { value } });

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/practice']}>
      <Practice />
    </MemoryRouter>
  );
}

describe('Practice page (lightweight)', () => {
  test('renders title and mode selector', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: /practice/i })).toBeInTheDocument();

    // Mode select & label
    const modeLabel = screen.getByLabelText(/mode/i);
    expect(modeLabel).toBeInTheDocument();
    expect(modeLabel.tagName.toLowerCase()).toBe('select');

    // Has the two options you showed
    expect(within(modeLabel).getByRole('option', { name: /find by a1c/i })).toBeInTheDocument();
    expect(within(modeLabel).getByRole('option', { name: /find by last visit/i })).toBeInTheDocument();
  });

  test('renders A1C search form elements', () => {
    renderPage();

    // Region wrapper
    expect(screen.getByRole('region', { name: /search patients/i })).toBeInTheDocument();

    // Labeled number fields (spinbuttons)
    const minA1C = screen.getByLabelText(/min a1c\s*\(%\)/i);
    const maxA1C = screen.getByLabelText(/max a1c\s*\(%\)/i);
    expect(minA1C).toBeInTheDocument();
    expect(maxA1C).toBeInTheDocument();
    expect(minA1C).toHaveAttribute('type', 'number');
    expect(maxA1C).toHaveAttribute('type', 'number');

    // Submit button
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('changing mode select updates its value', () => {
    renderPage();

    const mode = screen.getByLabelText(/mode/i);
    // initial is whatever the component sets; change it to "visit"
    fireEvent.change(mode, { target: { value: 'visit' } });
    expect(mode).toHaveValue('visit');
  });

  test('submitting the form with A1C min/max does not crash', () => {
    renderPage();

    const minA1C = screen.getByLabelText(/min a1c/i);
    const maxA1C = screen.getByLabelText(/max a1c/i);
    const submit = screen.getByRole('button', { name: /search/i });

    type(minA1C, '6.5');
    type(maxA1C, '8.0');
    click(submit);

    // Your current UI shows a "No results yet" text until wired to data;
    // Just assert the page is still rendered and header is present.
    expect(screen.getByRole('heading', { name: /practice/i })).toBeInTheDocument();
  });
});
