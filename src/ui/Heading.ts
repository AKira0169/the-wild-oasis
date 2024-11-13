import styled, { css } from 'styled-components';

interface HeadingProps {
  as?: 'h1' | 'h2' | 'h3';
}

const headingStyles = {
  h1: css`
    font-size: 3rem;
    font-weight: 700;
  `,
  h2: css`
    font-size: 2rem;
    font-weight: 600;
  `,
  h3: css`
    font-size: 2rem;
    font-weight: 500;
  `,
} as const;

// Type guard to ensure the key exists in headingStyles
const getHeadingStyle = (level: 'h1' | 'h2' | 'h3') => headingStyles[level];

const Heading = styled.h1<HeadingProps>`
  ${({ as = 'h3' }) => getHeadingStyle(as)}
  line-height: 1.2;
`;

export default Heading;
