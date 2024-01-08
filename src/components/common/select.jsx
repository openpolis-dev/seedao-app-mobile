import styled from 'styled-components';
import Select from 'react-select';

export default function SeeSelect({ width, closeClear, ...props }) {
  return (
    <SelectStyle
      className="react-select-container"
      classNamePrefix="react-select"
      width={width}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: "var(--primary-color)",
          primary: "var(--primary-color)",
          neutral0: "var(--border-color-1)",
        },
      })}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          fontSize: "10px",
          backgroundColor: "#E2E2EE",
          borderColor: "transparent",
        }),
      }}
      isClearable={!closeClear}
      {...props}
    />
  );
}

const SelectStyle = styled(Select)`
  //min-width: 185px;
  min-width: ${(props) => (props.width ? props.width : "185px")};
  .react-select__input,
  .react-select__single-value {
    color: var(--font-color) !important;
  }
  .react-select__menu-list {
    padding: 0;
  }
  .react-select__menu {
    padding: 0;
  }
  .react-select__menu,
  .react-select__option--is-selected {
    font-size: 10px;
    color: var(--font-color) !important;
  }
  .react-select__indicator-separator {
    display: none;
  }
  .react-select__value-container {
    padding-right: 0;
  }
  .react-select__indicator {
    padding: 0 4px 0 0;
  }
  .react-select__indicator {
    width: 20px;
    svg {
      transform: scale(0.8);
      path {
        fill: var(--font-light-color);
      }
    }
  }
  .react-select__control {
    border-radius: 6px;
    height: ${(props) => (props.height ? props.height : "24px")} !important;
    min-height: unset;
  }
  .react-select__control--is--focused {
    border-color: var(--primary-color) !important;
  }
`;
