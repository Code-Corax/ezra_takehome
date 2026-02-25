import { useState } from "react";
import {
    Button, Dialog, Field, Input,
    Portal, Textarea, VStack,
} from "@chakra-ui/react";
import type { CreateTodoInput } from "../api/todoApiModels";
import { useTheme } from "styled-components";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: CreateTodoInput) => Promise<void> | void;
};

const DEFAULT_TITLE = "",
DEFAULT_DESCRIPTION = "",
DEFAULT_PRIORITY = 0;

function CreateTodoModal({ isOpen, onClose, onSubmit }: Props) {
    const [title, setTitle] = useState(DEFAULT_TITLE);
    const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
    const [priority, setPriority] = useState(DEFAULT_PRIORITY);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();

    const canSubmit = title.trim().length > 0 && priority >= 0 && priority <= 5;

    async function handleSubmit() {
        if (!canSubmit) return;
        setError(null);
        setIsSubmitting(true);
        try {
        await onSubmit({
            title: title.trim(),
            description: description.trim(),
            priority,
        });
        clearAndClose();
        } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to create todo");
        } finally {
        setIsSubmitting(false);
        }
    }

    function clearFields() {
        setTitle(DEFAULT_TITLE);
        setDescription(DEFAULT_DESCRIPTION);
        setPriority(DEFAULT_PRIORITY);
    }

    function clearAndClose() {
        clearFields();
        onClose();
    }

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={(details) => {
                if (!details.open) clearAndClose();
            }}
            placement="center"
            motionPreset="scale"
            >
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(2px)" />
                <Dialog.Positioner>
                <Dialog.Content bg={theme.colorBg2}
                    color={theme.colorGrey0} 
                    borderColor={theme.borderColor2}
                    borderWidth="1px" >
                    <Dialog.Header>
                    <Dialog.Title fontSize="xl" fontWeight="700">Create Todo</Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body>
                    <VStack gap="4" align="stretch">
                        <Field.Root required>
                        <Field.Label fontWeight="600">Title</Field.Label>
                        <Input
                            bg={theme.colorBg2} color={theme.colorGrey0} borderColor={theme.borderColor2}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Task's title"
                            size="md"
                            borderRadius="md"
                        />
                        {!canSubmit && title.trim().length === 0 ? (
                        <Field.HelperText color="red.500">Title is required.</Field.HelperText>
                        ) : null}
                        </Field.Root>

                        <Field.Root>
                        <Field.Label>Description</Field.Label>
                        <Textarea
                            bg={theme.colorBg2} color={theme.colorGrey0} borderColor={theme.borderColor2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional description text"
                            resize="vertical"
                            minH="96px"
                        />
                        </Field.Root>

                        <Field.Root required>
                        <Field.Label>Priority (0-5)</Field.Label>
                        <Input
                            bg={theme.colorBg2} color={theme.colorGrey0} borderColor={theme.borderColor2}
                            type="number"
                            min={0}
                            max={5}
                            value={priority}
                            onChange={(e) => setPriority(Number(e.target.value))}
                        />
                        </Field.Root>

                        {error ? (
                        <Field.HelperText color="red.500">{error}</Field.HelperText>
                        ) : null}
                    </VStack>
                    </Dialog.Body>

                    <Dialog.Footer>
                    <Button variant="solid" 
                        onClick={clearAndClose} 
                        disabled={isSubmitting}
                        _hover={{ borderColor: "gray.200", boxShadow: "0 0 0 3px rgba(226,232,240,0.35)"}}
                    >
                        Cancel
                    </Button>
                    <Button colorPalette="green" 
                        onClick={handleSubmit} 
                        loading={isSubmitting} 
                        disabled={!canSubmit}
                         _hover={{ bg: "green.500", borderColor: "green.300", boxShadow: "0 0 0 3px rgba(74,222,128,0.45)"}}
                        _active={{ bg: "green.700" }}
                        _focusVisible={{ boxShadow: "0 0 0 3px rgba(34,197,94,0.35)" }}
                    >
                        Create
                    </Button>
                    </Dialog.Footer>

                    <Dialog.CloseTrigger />
                </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

export default CreateTodoModal;