import { useCombobox } from 'downshift';
import PropTypes from 'prop-types';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

function Search(props) {
  const { getMenuProps, getInputProps, getComboboxProps } = useCombobox({
    items: [],
    onInputValueChange() {
      console.log('Input Changed');
    },
    onSelectedItemChange() {
      console.log('Selected Item Change');
    },
  });
  return (
    <SearchStyles>
      <div>
        <input type="search" />
      </div>
      <DropDown>
        <DropDownItem>Hey</DropDownItem>
        <DropDownItem>Hey</DropDownItem>
        <DropDownItem>Hey</DropDownItem>
        <DropDownItem>Hey</DropDownItem>
      </DropDown>
    </SearchStyles>
  );
}

export default Search;
