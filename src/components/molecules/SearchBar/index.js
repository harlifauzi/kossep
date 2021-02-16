import React from "react";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const SearchBar = ({onChangeCariResep, onCariResep, value}) => {
    return (
        <InputGroup className="mb-3">
            <FormControl
                placeholder="tuliskan judul resep"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                className="halamaneksplor-searchbar"
                value={value}
                onChange={onChangeCariResep}
            />
            <InputGroup.Append>
                <Button variant="danger" onClick={onCariResep}>
                    cari resep
                </Button>
            </InputGroup.Append>
        </InputGroup>
    );
};

export default SearchBar;
