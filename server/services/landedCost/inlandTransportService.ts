import type { LandedCostInput } from './types';

export interface InlandTransportResult {
  origin: {
    cost: number;
    distance?: number;
    method?: string;
    notes: string[];
  };
  destination: {
    cost: number;
    distance?: number;
    method?: string;
    notes: string[];
  };
  total: number;
}

export function calculateOriginTransport(input: LandedCostInput): InlandTransportResult['origin'] {
  const notes: string[] = [];
  let cost: number;

  if (input.inlandTransportOrigin !== undefined && input.inlandTransportOrigin !== null) {
    if (input.inlandTransportOrigin < 0) {
      throw new Error('Origin transport cost must be >= 0');
    }
    cost = input.inlandTransportOrigin;
    notes.push('Using user-provided origin transport cost');
  } else {
    if (input.incoterm === 'EXW') {
      cost = 200;
      notes.push('Estimated origin transport cost (EXW - factory to port)');
    } else {
      cost = 0;
      notes.push('No origin transport cost (seller delivers to port)');
    }
  }

  return {
    cost,
    method: 'truck',
    notes,
  };
}

export function calculateDestinationTransport(input: LandedCostInput): InlandTransportResult['destination'] {
  const notes: string[] = [];
  let cost: number;

  if (input.inlandTransportDestination !== undefined && input.inlandTransportDestination !== null) {
    if (input.inlandTransportDestination < 0) {
      throw new Error('Destination transport cost must be >= 0');
    }
    cost = input.inlandTransportDestination;
    notes.push('Using user-provided destination transport cost');
  } else {
    cost = 300;
    notes.push('Estimated destination transport cost (port to warehouse)');
  }

  return {
    cost,
    method: 'truck',
    notes,
  };
}

export function calculateInlandTransport(input: LandedCostInput): InlandTransportResult {
  const origin = calculateOriginTransport(input);
  const destination = calculateDestinationTransport(input);
  const total = origin.cost + destination.cost;

  return {
    origin,
    destination,
    total,
  };
}