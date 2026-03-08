import { render, screen, fireEvent } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';

// simple translations mock (not used in this component but safe)
jest.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }));

import DualListSelector, { DualListItem } from '../dual-list-selector';

describe('DualListSelector — behavior tests', () => {
  const makeWrapper = (defaultValues: any = {}) => {
    return ({ children }: any) => {
      const methods = useForm({ defaultValues });
      return <FormProvider {...methods}>{children}</FormProvider>;
    };
  };

  it('moves selected available item to selected list by invoking onSelectedItemAdded', () => {
    const availableItems: DualListItem[] = [
      { id: 'a1', description: () => 'Alice', source: {} },
      { id: 'a2', description: () => 'Bob', source: {} }
    ];

    const onSelectedItemAdded = jest.fn();
    const onSelectedItemRemoved = jest.fn();

    const Wrapper = makeWrapper({ selectedItems: [] });

    const { container } = render(
      <DualListSelector
        availableItems={availableItems}
        formStateField="selectedItems"
        sourceLabel="Available"
        selectedLabel="Selected"
        isEditMode={true}
        onSelectedItemAdded={onSelectedItemAdded}
        onSelectedItemRemoved={onSelectedItemRemoved}
      />,
      { wrapper: Wrapper }
    );

    // click available item Alice
    fireEvent.click(screen.getByText('Alice'));

    // find the button that contains the right-chevron icon and click it
    const rightIcon = container.querySelector('i.bi-chevron-right');
    expect(rightIcon).toBeTruthy();
    const rightBtn = rightIcon!.parentElement as HTMLElement;
    fireEvent.click(rightBtn);

    expect(onSelectedItemAdded).toHaveBeenCalledWith(availableItems[0], false);
  });

  it('invokes add-all when double-right button is clicked', () => {
    const availableItems: DualListItem[] = [
      { id: 'a1', description: () => 'Alice', source: {} },
      { id: 'a2', description: () => 'Bob', source: {} }
    ];

    const onSelectedItemAdded = jest.fn();
    const onSelectedItemRemoved = jest.fn();

    const Wrapper = makeWrapper({ selectedItems: [] });

    const { container } = render(
      <DualListSelector
        availableItems={availableItems}
        formStateField="selectedItems"
        sourceLabel="Available"
        selectedLabel="Selected"
        isEditMode={true}
        onSelectedItemAdded={onSelectedItemAdded}
        onSelectedItemRemoved={onSelectedItemRemoved}
      />,
      { wrapper: Wrapper }
    );

    const doubleRight = container.querySelector('i.bi-chevron-double-right');
    expect(doubleRight).toBeTruthy();
    fireEvent.click(doubleRight!.parentElement as HTMLElement);

    expect(onSelectedItemAdded).toHaveBeenCalledWith(undefined, true);
  });

  it('removes selected item when left-chevron clicked', () => {
    const selectedItem = { id: 's1', description: () => 'Selected One', source: {} } as DualListItem;

    const availableItems: DualListItem[] = [];
    const onSelectedItemAdded = jest.fn();
    const onSelectedItemRemoved = jest.fn();

    const Wrapper = makeWrapper({ selectedItems: [selectedItem] });

    const { container } = render(
      <DualListSelector
        availableItems={availableItems}
        formStateField="selectedItems"
        sourceLabel="Available"
        selectedLabel="Selected"
        isEditMode={true}
        onSelectedItemAdded={onSelectedItemAdded}
        onSelectedItemRemoved={onSelectedItemRemoved}
      />,
      { wrapper: Wrapper }
    );

    // click the selected item
    fireEvent.click(screen.getByText('Selected One'));

    // find left-chevron (move selected to available)
    const leftIcon = container.querySelector('i.bi-chevron-left');
    expect(leftIcon).toBeTruthy();
    fireEvent.click(leftIcon!.parentElement as HTMLElement);

    expect(onSelectedItemRemoved).toHaveBeenCalled();
  });
});
