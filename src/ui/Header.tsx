import styled from 'styled-components';

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);

  display: flex;
  justify-content: flex-end;
  align-items: center;

  /* grid-column: 1 / -1; */
`;

function Header() {
  return <StyledHeader>Header</StyledHeader>;
}

export default Header;
