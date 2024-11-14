import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import FormRow from '../../ui/FormRow';
import { createCabin, updateCabin } from '../../services/apiCabins';

interface CabinRowProps {
  cabin?: {
    id?: number;
    name?: string;
    maxCapacity?: number;
    regularPrice?: number;
    discount?: number;
    image?: string;
  };
}

type FormValues = {
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: FileList; // Change this to FileList, because that's what file inputs return
};

type EditCabin = {
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: File | string; // Can be either File or string in the update process
};

function CreateCabinForm({ cabin = {} }: CabinRowProps) {
  const { id: editId, name, maxCapacity, regularPrice, discount, image: oldImage } = cabin;

  const { register, handleSubmit, getValues, formState } = useForm<FormValues>({
    defaultValues: {
      name,
      maxCapacity,
      regularPrice,
      discount,
      description: '',
    },
  });

  const isEditSession = Boolean(editId);
  const queryClint = useQueryClient();

  const { mutate: mutateCreateCabin, isPending: isCreating } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success('New cabin successfully created');
      queryClint.invalidateQueries({ queryKey: ['cabins'] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { mutate: editCabin, isPending: isEditing } = useMutation({
    mutationFn: ({ newCabin, id }: { newCabin: EditCabin; id: number }) => updateCabin(newCabin, id),
    onSuccess: () => {
      toast.success('Cabin successfully edited');
      queryClint.invalidateQueries({ queryKey: ['cabins'] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { errors } = formState;
  const isWorking = isCreating || isEditing;

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    let image: File | string = '';

    if (data.image instanceof FileList && data.image.length > 0) {
      image = data.image[0];
    } else if (oldImage) {
      image = oldImage;
    }

    if (isEditSession) {
      editCabin({ newCabin: { ...data, image }, id: editId! });
    } else {
      mutateCreateCabin({ ...data, image });
    }
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label='Cabin name' error={errors?.name?.message}>
        <Input
          type='text'
          id='name'
          {...register('name', {
            required: 'This field is required',
          })}
        />
      </FormRow>
      <FormRow label='Maximum capacity' error={errors?.maxCapacity?.message}>
        <Input
          type='number'
          id='maxCapacity'
          {...register('maxCapacity', {
            required: 'This field is required',
            min: { value: 1, message: 'Cabin name must be at least 1 character long' },
          })}
        />
      </FormRow>
      <FormRow label='Regular price' error={errors?.regularPrice?.message}>
        <Input
          type='number'
          id='regularPrice'
          {...register('regularPrice', {
            required: 'This field is required',
            min: { value: 1, message: 'Cabin name must be at least 1 character long' },
          })}
        />
      </FormRow>
      <FormRow label='Discount' error={errors?.discount?.message}>
        <Input
          type='number'
          id='discount'
          defaultValue={0}
          {...register('discount', {
            validate: (value: number) => {
              return Number(value) < Number(getValues().regularPrice) || 'Discount should be less than regular price';
            },
          })}
        />
      </FormRow>
      <FormRow label='Description for website' error={errors?.description?.message}>
        <Textarea id='description' defaultValue='' {...register('description')} />
      </FormRow>

      <FormRow label='Cabin photos' error={errors?.image?.message}>
        <FileInput
          id='image'
          type='file'
          accept='image/*'
          {...register('image', {
            required: isEditSession ? false : 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label='&nbsp;'>
        <Button variation='secondary' type='reset'>
          Cancel
        </Button>
        <Button disabled={isWorking}>{isEditSession ? 'Update cabin' : 'Submit cabin'}</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
