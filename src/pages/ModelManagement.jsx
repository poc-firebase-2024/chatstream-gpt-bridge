import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const ModelManagement = () => {
  const { t } = useTranslation();
  const [models, setModels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState({ name: '' });

  useEffect(() => {
    // Fetch models from API or local storage
    const fetchedModels = [{ id: 1, name: 'Salesforce/codegen-350M-multi' }];
    setModels(fetchedModels);
  }, []);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setCurrentModel({ name: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (model) => {
    setCurrentModel(model);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setModels(models.filter(model => model.id !== id));
  };

  const handleSave = () => {
    if (currentModel.id) {
      setModels(models.map(model => model.id === currentModel.id ? currentModel : model));
    } else {
      setModels([...models, { ...currentModel, id: Date.now() }]);
    }
    setIsDialogOpen(false);
  };

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedModels = filteredModels.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentModels = sortedModels.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sortedModels.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{t('modelManagement')}</h1>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder={t('searchModels')}
          value={searchTerm}
          onChange={handleSearch}
          className="w-64"
        />
        <Button onClick={handleAdd}>{t('addModel')}</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
              {t('modelName')} {sortColumn === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentModels.map((model) => (
            <TableRow key={model.id}>
              <TableCell>{model.name}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2" onClick={() => handleEdit(model)}>{t('edit')}</Button>
                <Button variant="destructive" onClick={() => handleDelete(model.id)}>{t('delete')}</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-center">
        {pageNumbers.map(number => (
          <Button
            key={number}
            onClick={() => setCurrentPage(number)}
            variant={currentPage === number ? "default" : "outline"}
            className="mx-1"
          >
            {number}
          </Button>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentModel.id ? t('editModel') : t('addModel')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t('modelName')}
              </Label>
              <Input
                id="name"
                value={currentModel.name}
                onChange={(e) => setCurrentModel({ ...currentModel, name: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSave}>{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModelManagement;