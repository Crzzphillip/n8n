import React from 'react';
import { render } from '@testing-library/react';
import NodeView from '../components/editor/NodeView';

describe('NodeView', () => {
  it('renders without crashing (new workflow)', () => {
    // Minimal smoke test; in real tests, mock stores and router
    const { getByText } = render(<NodeView mode="new" /> as any);
    expect(getByText(/Loading|Workflow|Save/i)).toBeTruthy();
  });
});