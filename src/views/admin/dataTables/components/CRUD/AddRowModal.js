// components/AddRowModal.js
import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  CheckboxGroup,
  Checkbox,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const AddRowModal = ({ onAddRow }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newRow, setNewRow] = useState({
    name: '',
    tech: [],
    date: '',
    progress: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prevRow) => ({ ...prevRow, [name]: value }));
  };

  const handleTechChange = (tech) => {
    setNewRow((prevRow) => ({ ...prevRow, tech }));
  };

  const handleAddRow = () => {
    onAddRow(newRow);
    setNewRow({ name: '', tech: [], date: '', progress: 0 });
    onClose();
  };

  return (
    <>
      <IconButton icon={<AddIcon />} onClick={onOpen} aria-label="Add Row" />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Row</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input name="name" value={newRow.name} onChange={handleChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Tech</FormLabel>
              <CheckboxGroup value={newRow.tech} onChange={handleTechChange}>
                <Checkbox value="apple">Apple</Checkbox>
                <Checkbox value="android">Android</Checkbox>
                <Checkbox value="windows">Windows</Checkbox>
              </CheckboxGroup>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                name="date"
                value={newRow.date}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Progress</FormLabel>
              <Input
                type="number"
                name="progress"
                value={newRow.progress}
                onChange={handleChange}
                max={100}
                min={0}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddRow}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddRowModal;
