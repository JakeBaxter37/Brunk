export function cleanNumber(text: string, maxLength: number, allowDecimal = false): string 
{
    let cleaned = text.replace(allowDecimal ? /[^0-9.]/g : /[^0-9]/g, "");

    if (allowDecimal) 
    {
        const parts = cleaned.split(".");
        if (parts.length > 2) cleaned = parts[0] + "." + parts.slice(1).join("");
    }
    return cleaned.slice(0, maxLength);
}

export function cleanRpe(text: string): string {
    const cleaned = cleanNumber(text, 3, true);
    return Number(cleaned) > 10 ? "10" : cleaned;
}