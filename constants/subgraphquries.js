import { gql } from "@apollo/client";

export const GET_ACTIVE_ITEMS = gql`
  query GetActiveItems {
    activeItems {
      id
      nftAddress
      tokenId
      price
      seller
    }
  }
`;

export default GET_ACTIVE_ITEMS;
