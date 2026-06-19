import { css } from "lit";

export const defaultImageStyle = css`
.image-container {
  border: 3px inset #808080;
  background-color: #fff;
  padding: 4px;
  display: flex;          
  justify-content: center;
  align-items: center;
  width: 100%;                 
  height: 300px;               
  box-sizing: border-box;
}

.image-container img {
  width: 100%;
  max-height: 100%;
  object-fit: cover;        
  display: block;
}
`