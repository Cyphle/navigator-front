import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, TimePicker } from 'antd';
import dayjs from 'dayjs';
import type { CreateCalendarEventInput, RecurrenceType, Calendar } from '../../../stores/calendars/calendars.types';

interface CreateEventFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (input: CreateCalendarEventInput) => void;
  isLoading?: boolean;
  eventId?: number | null;
  calendars: Calendar[];
  selectedCalendarId: number | null;
}

const RECURRENCE_OPTIONS = [
  { value: 'NONE', label: 'Aucune' },
  { value: 'DAILY', label: 'Quotidienne' },
  { value: 'WEEKLY', label: 'Hebdomadaire' },
  { value: 'MONTHLY', label: 'Mensuelle' },
  { value: 'YEARLY', label: 'Annuelle' },
];

export const CreateEventForm = ({
  open,
  onCancel,
  onSubmit,
  isLoading,
  calendars,
  selectedCalendarId,
}: CreateEventFormProps) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const input: CreateCalendarEventInput = {
        title: values.title,
        description: values.description,
        invites: values.invites?.split(',').map((email: string) => email.trim()).filter(Boolean),
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm'),
        duration: values.duration,
        recurrence: values.recurrence,
      };
      onSubmit(input);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Nouvel événement"
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Annuler
        </Button>,
        <Button key="submit" type="primary" loading={isLoading} onClick={handleSubmit}>
          Créer
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          recurrence: 'NONE',
          duration: 60,
          date: dayjs(),
          time: dayjs(),
        }}
      >
        <Form.Item
          label="Calendrier"
          name="calendarId"
          initialValue={selectedCalendarId}
        >
          <Select
            disabled
            options={calendars.map((calendar) => ({
              value: calendar.id,
              label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: calendar.color,
                    }}
                  />
                  {calendar.name}
                </div>
              ),
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Titre"
          name="title"
          rules={[{ required: true, message: 'Le titre est requis' }]}
        >
          <Input placeholder="Ex: Réunion d'équipe" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Description de l'événement" rows={3} />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: 'La date est requise' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          label="Heure"
          name="time"
          rules={[{ required: true, message: "L'heure est requise" }]}
        >
          <TimePicker style={{ width: '100%' }} format="HH:mm" minuteStep={15} />
        </Form.Item>

        <Form.Item
          label="Durée (minutes)"
          name="duration"
          rules={[{ required: true, message: 'La durée est requise' }]}
        >
          <InputNumber min={15} max={1440} step={15} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Récurrence" name="recurrence">
          <Select options={RECURRENCE_OPTIONS} />
        </Form.Item>

        <Form.Item
          label="Invités (emails séparés par des virgules)"
          name="invites"
        >
          <Input placeholder="email1@example.com, email2@example.com" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
