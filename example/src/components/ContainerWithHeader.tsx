interface ContainerWithHeaderProps {
  backgroundColor: string;
  textColor: string;
  isTextGradient?: boolean;
}

function ContainerWithHeader({ backgroundColor, textColor, isTextGradient=false }: ContainerWithHeaderProps) {
  return (
    <div className={`w-full rounded-md overflow-hidden border dark:border-zinc-800 light:border-zinc-200`}>
      <div className="py-3 px-4 font-semibold text-xl tracking-wide" style={{background: backgroundColor}}>
          <span
              className="text-lg font-bold rounded tracking-wide inline-block"
              style={
                isTextGradient
                  ? {
                      backgroundImage: textColor,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }
                  : { }
              }
            >

        Gradient Header Preview
            </span>
      </div>
      <div className="p-4 text-base">
        <p>Text content with your chosen color scheme</p>
      </div>
    </div>
  );
}

export default ContainerWithHeader;
