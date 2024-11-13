import styled, { css } from 'styled-components';

interface HeadingProps {
  type?: 'horizontal' | 'vertical';
}

const Row = styled.div<HeadingProps>`
  display: flex;

  ${({ type }) =>
    type === 'horizontal' &&
    css`
      align-items: center;
      justify-content: space-between;
    `}

  ${({ type }) =>
    type === 'vertical' &&
    css`
      flex-direction: column;
      gap: 1.6rem;
    `}
`;

Row.defaultProps = {
  type: 'vertical',
};

export default Row;
