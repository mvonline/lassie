export interface Movie {
  title: string;
  code: 'regular' | 'new' | 'childrens';
}

export interface Movies {
  [id: string]: Movie;
}

export interface Rental {
  movieID: string;
  days: number;
}

export interface Customer {
  name: string;
  rentals: Rental[];
}

interface RentalDetails {
  title: string;
  amount: number;
}

interface StatementData {
  customerName: string;
  rentals: RentalDetails[];
  totalAmount: number;
  frequentRenterPoints: number;
}


const RENTAL_RULES = {
  regular: {
    baseAmount: 2,
    thresholdDays: 2,
    extraRate: 1.5,
  },
  new: {
    rate: 3,
    bonusThreshold: 2,
  },
  childrens: {
    baseAmount: 1.5,
    thresholdDays: 3,
    extraRate: 1.5,
  },
} as const;



/**
 * Simple helper for "Base + Extra" pricing logic.
 */
const calcThresholdAmount = (days: number, { baseAmount, thresholdDays, extraRate }: { baseAmount: number, thresholdDays: number, extraRate: number }) =>
  days > thresholdDays ? baseAmount + (days - thresholdDays) * extraRate : baseAmount;

/**
 * Calculations for amounts by movie code.
 */
const AmountCalculators: Record<Movie['code'], (days: number) => number> = {
  regular: (days) => calcThresholdAmount(days, RENTAL_RULES.regular),
  childrens: (days) => calcThresholdAmount(days, RENTAL_RULES.childrens),
  new: (days) => days * RENTAL_RULES.new.rate,
};

/**
 * Calculations for frequent renter points by movie code.
 */
const PointsCalculators: Record<Movie['code'], (days: number) => number> = {
  regular: () => 1,
  childrens: () => 1,
  new: (days) => (days > RENTAL_RULES.new.bonusThreshold ? 2 : 1),
};

function calculateAmount(movie: Movie, days: number): number {
  const calculator = AmountCalculators[movie.code];
  if (!calculator) throw new Error(`Unknown movie code: ${movie.code}`);
  return calculator(days);
}

function calculatePoints(movie: Movie, days: number): number {
  const calculator = PointsCalculators[movie.code];
  return calculator ? calculator(days) : 1;
}

/**
 * Transforms raw data into a structured statement data object.
 * This separates business logic from formatting.
 */
function createStatementData(customer: Customer, movies: Movies): StatementData {
  const rentalDetails = customer.rentals.map(rental => {
    const movie = movies[rental.movieID];
    if (!movie) {
      throw new Error(`Movie with ID ${rental.movieID} not found.`);
    }

    return {
      title: movie.title,
      amount: calculateAmount(movie, rental.days),
      points: calculatePoints(movie, rental.days),
    };
  });

  return {
    customerName: customer.name,
    rentals: rentalDetails,
    totalAmount: rentalDetails.reduce((sum, r) => sum + r.amount, 0),
    frequentRenterPoints: rentalDetails.reduce((sum, r) => sum + r.points, 0),
  };
}

/**
 * Formats the statement data into a text string.
 */
function renderPlainText(data: StatementData): string {
  let result = `Rental Record for ${data.customerName}\n`;
  for (let r of data.rentals) {
    result += `\t${r.title}\t${r.amount}\n`;
  }
  result += `Amount owed is ${data.totalAmount}\n`;
  result += `You earned ${data.frequentRenterPoints} frequent renter points\n`;
  return result;
}

/**
 * Main entry point for generating the statement.
 * Full TypeScript safety for customer and movie data.
 */
export function statement(customer: Customer, movies: Movies): string {
  const data = createStatementData(customer, movies);
  return renderPlainText(data);
}





// Refactored logic exported for testing